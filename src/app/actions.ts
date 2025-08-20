"use server";

import net from "net";
import { headers } from "next/headers";

type SingBoxConfigContext = {
    coreMinorVersion: number;
    coreFixVersion: number;
    serverName: string;
    serverAddress: string;
    protocol: Protocol;
    clientUUID: string;
    withTunneling: boolean;
    includeAntizapret: boolean;
    sni: string;
    publicKey: string;
    shortId: string;
}

type Protocol = "vless" | "shadowsocks";

type Credentials = {
    id: string;
    ssocksPassword?: string;
}

const getLogConfig = () => `
{
    "level": "warn",
    "timestamp": true
}
`;

const getDnsConfig = () => `
{
    "servers": [
        {
            "tag": "local-dns",
            "address": "local"
        }
    ]
}
`;

const getInboundsConfig = () => `
[
    {
        "type": "tun",
        "tag": "tun-in",
        "inet4_address": "172.19.0.1/30",
        "mtu": 1492,
        "auto_route": true,
        "strict_route": false,
        "stack": "gvisor",
        "sniff": true,
        "sniff_override_destination": true
    }
]
`;

const getProxyOutboundConfig = (ctx: SingBoxConfigContext): string => {
    switch (ctx.protocol) {
        case "shadowsocks": {
            const password = getShadowsocksPasswordByClientID(ctx.clientUUID);
            if (password === undefined) {
                throw new Error("У вас нет доступа к протоколу Shadowsocks");
            }
            const ssocksMethod = process.env.PROXY_SHADOWSOCKS_METHOD!;
            const ssocksPort = getShadowsocksPortByServerName(ctx.serverName);
            return (`{
    "tag": "proxy-out",
    "type": "shadowsocks",
    "server": "${ctx.serverAddress}",
    "server_port": ${ssocksPort},
    "method": "${ssocksMethod}",
    "password": "${password}",
    "udp_over_tcp": {
        "enabled": true
    }
}
`)
        }
        default: {
            return (`{
    "tag": "proxy-out",
    "type": "vless",
    "server": "${ctx.serverAddress}",
    "server_port": 443,
    "uuid": "${ctx.clientUUID}",
    "flow": "xtls-rprx-vision",
    "tls": {
        "enabled": true,
        "server_name": "${ctx.sni}",
        "utls": {
            "enabled": true,
            "fingerprint": "chrome"
        },
        "reality": {
            "enabled": true,
            "public_key": "${ctx.publicKey}",
            "short_id": "${ctx.shortId}"
        }
    }
}
`);
        }
    }
};

const getOutboundsConfig = (ctx: SingBoxConfigContext): string => (`
[
    {
        "type": "direct",
        "tag": "direct-out"
    },
    ${getProxyOutboundConfig(ctx)},
    {
        "type": "dns",
        "tag": "dns-out"
    }
]
`);

const getRouteConfig = (ctx: SingBoxConfigContext): string => `
{
    "auto_detect_interface": true,
    "rules": [
        { "port": 853, "outbound": "dns-out" },
        ${ctx.includeAntizapret ? `{
            "rule_set": "antizapret",
            "outbound": "proxy-out"
        },` : ""}
        {
            "rule_set": "keelfy-custom",
            "outbound": "proxy-out"
        }
    ],
    "rule_set": [
        ${ctx.includeAntizapret ? `{
            "tag": "antizapret",
            "type": "remote",
            "format": "binary",
            "url": "https://github.com/savely-krasovsky/antizapret-sing-box/releases/latest/download/antizapret.srs",
            "download_detour": "direct-out"
        },` : ""}
        {
            "tag": "keelfy-custom",
            "type": "remote",
            "format": "binary",
            "url": "https://github.com/keelfy/sing-box-cfg/blob/main/sulfur-custom.srs?raw=true",
            "download_detour": "direct-out"
        }
    ]
}
`;

const getRouteAllConfig = (): string => `
{
    "auto_detect_interface": true,
    "final": "proxy-out"
}
`;
const getExperimentalConfig = () => `
{
    "cache_file": {
        "enabled": true
    }
}
`;

function clearUUID(uuid: string) {
    return uuid.trim().toUpperCase();
}

function getClientCredentialsList(): Credentials[] {
    const credentialsList: Credentials[] = []
    process.env.PROXY_ALLOWED_CLIENT_UUIDS!.split(",").forEach(client => {
        const values = client.split(":");
        credentialsList.push({
            id: clearUUID(values[0]),
            ssocksPassword: values.length > 1 ? values[1] : undefined
        });
    });

    return credentialsList;
}

function validateClientUUID(clientUUID: string): boolean {
    const credentials = getClientCredentialsList();
    return credentials.map(cred => cred.id).includes(clearUUID(clientUUID));
}

function getShadowsocksPasswordByClientID(clientId: string): string | undefined {
    const credentials = getClientCredentialsList();
    return credentials.find(cred => cred.id === clientId)?.ssocksPassword;
}

async function getClientIP() {
    const headersList = await headers();
    return headersList.get('x-forwarded-for') ||
        headersList.get('x-real-ip') ||
        'Unknown IP';
}

export async function getConfigByClientUUID(
    serverName: string,
    protocol: Protocol,
    clientUUID: string,
    withTunneling: boolean = true,
    includeAntizapret: boolean = true
) {
    const clientIP = await getClientIP();
    console.log(`[${new Date().toISOString()}] Config generation attempt from IP: ${clientIP} for UUID: ${clientUUID}`);

    const sanitizedClientUUID = clearUUID(clientUUID);
    if (!validateClientUUID(sanitizedClientUUID)) {
        throw new Error("Клиент не найден");
    }

    const ctx = {
        coreMinorVersion: 11,
        coreFixVersion: 0,
        serverName: serverName,
        serverAddress: getServerIPByServerName(serverName),
        protocol: protocol,
        clientUUID: sanitizedClientUUID,
        withTunneling: withTunneling,
        includeAntizapret: includeAntizapret,
        sni: getSniByServerName(serverName),
        publicKey: getPublicKeyByServerName(serverName),
        shortId: getShortIdByServerName(serverName)
    }
    const config = `
    {
        "log": ${getLogConfig()},
        "dns": ${getDnsConfig()},
        "inbounds": ${getInboundsConfig()},
        "outbounds": ${getOutboundsConfig(ctx)},
        "route": ${withTunneling ? getRouteConfig(ctx) : getRouteAllConfig()},
        "experimental": ${getExperimentalConfig()}
    }
    `;
    return JSON.stringify(JSON.parse(config), null, 2);
}

const getLinkByClientUUID = (ctx: SingBoxConfigContext): string => {
    switch (ctx.protocol) {
        case 'shadowsocks': {
            const password = getShadowsocksPasswordByClientID(ctx.clientUUID);
            if (password === undefined) {
                throw new Error("У вас нет доступа к протоколу Shadowsocks");
            }
            const ssocksMethod = process.env.PROXY_SHADOWSOCKS_METHOD!;
            const ssocksPort = process.env.PROXY_SHADOWSOCKS_PORT!;
            const credentials = Buffer.from(`${ssocksMethod}:${password}`, 'ascii').toString('base64');
            return `ss://${credentials}@${ctx.serverAddress}:${ssocksPort}?type=tcp#SSOCKS%2B${ctx.serverName}`;
        }
        default: {
            return `vless://${ctx.clientUUID}@${ctx.serverAddress}:443?type=tcp&security=reality&pbk=${ctx.publicKey}&fp=chrome&sni=${ctx.sni}&sid=${ctx.shortId}&spx=%2F&flow=xtls-rprx-vision#VLESS%2B${ctx.serverName}`
        }
    }
};

export async function getLinkWithTunnelingByClientUUID(serverName: string, protocol: Protocol, clientUUID: string) {
    const clientIP = await getClientIP();
    console.log(`[${new Date().toISOString()}] Link generation attempt from IP: ${clientIP} for UUID: ${clientUUID}`);

    const sanitizedClientUUID = clearUUID(clientUUID);
    if (!validateClientUUID(sanitizedClientUUID)) {
        throw new Error("Клиент не найден");
    }

    const ctx: SingBoxConfigContext = {
        coreMinorVersion: 11,
        coreFixVersion: 0,
        serverName: serverName,
        serverAddress: getServerIPByServerName(serverName),
        protocol: protocol,
        clientUUID: sanitizedClientUUID,
        withTunneling: true,
        includeAntizapret: false,
        sni: getSniByServerName(serverName),
        publicKey: getPublicKeyByServerName(serverName),
        shortId: getShortIdByServerName(serverName)
    }
    return getLinkByClientUUID(ctx);
}

function pingVLESS(host: string, port: number, timeout: number = 5000): Promise<PingResult> {
    return new Promise((resolve) => {
        const socket = new net.Socket();

        socket.setTimeout(timeout);

        socket
            .connect(port, host, () => {
                resolve("success");
                socket.destroy();
            })
            .on('error', () => {
                resolve("error");
            })
            .on('timeout', () => {
                resolve("timeout");
                socket.destroy();
            });
    });
}

type PingResult = "success" | "error" | "timeout";

export async function pingProxyServers() {
    const results = await Promise.all(process.env.NEXT_PUBLIC_SERVER_NAMES!.split(";")
    .map(name => name.toLowerCase())
    .map(async serverName => {
        try {
            const result = await pingVLESS(getServerIPByServerName(serverName), 443);
            return {
                serverName: serverName,
                status: result
            };
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error pinging server ${serverName}: ${error}`);
            return {
                serverName: serverName,
                status: "error"
            }
        }
    }));
    return results;
}

function getServerIPByServerName(serverName: string) {
    let id = 0;
    const servers = process.env.PROXY_SERVERS!.split(";");
    const serverNames = process.env.NEXT_PUBLIC_SERVER_NAMES!.split(";").map(name => name.toLowerCase());

    for (const name of serverNames) {
        if (name === serverName.toLowerCase()) {
            return servers[id];
        }
        id++;
    }
    return servers[0];
}

function getSniByServerName(serverName: string) {
    const snis = process.env.PROXY_TLS_SERVER_NAMES!.split(";");
    let id = 0;
    const serverNames = process.env.NEXT_PUBLIC_SERVER_NAMES!.split(";").map(name => name.toLowerCase());

    for (const name of serverNames) {
        if (name === serverName.toLowerCase()) {
            return snis[id];
        }
        id++;
    }
    return snis[0];
}

function getPublicKeyByServerName(serverName: string) {
    const publicKeys = process.env.PROXY_TLS_PUBLIC_KEYS!.split(";");
    let id = 0;
    const serverNames = process.env.NEXT_PUBLIC_SERVER_NAMES!.split(";").map(name => name.toLowerCase());

    for (const name of serverNames) {
        if (name === serverName.toLowerCase()) {
            return publicKeys[id];
        }
        id++;
    }
    return publicKeys[0];
}

function getShortIdByServerName(serverName: string) {
    const shortIds = process.env.PROXY_TLS_SHORT_IDS!.split(";");
    let id = 0;
    const serverNames = process.env.NEXT_PUBLIC_SERVER_NAMES!.split(";").map(name => name.toLowerCase());

    for (const name of serverNames) {
        if (name === serverName.toLowerCase()) {
            return shortIds[id];
        }
        id++;
    }
    return shortIds[0];
}

function getShadowsocksPortByServerName(serverName: string) {
    const shadowsocksPorts = process.env.PROXY_SHADOWSOCKS_PORTS!.split(";");
    let id = 0;
    const serverNames = process.env.NEXT_PUBLIC_SERVER_NAMES!.split(";").map(name => name.toLowerCase());

    for (const name of serverNames) {
        if (name === serverName.toLowerCase()) {
            return shadowsocksPorts[id];
        }
        id++;
    }
    return shadowsocksPorts[0];
}
