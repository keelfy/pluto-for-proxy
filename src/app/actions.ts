"use server";

import net from "net";
import { headers } from "next/headers";

type Protocol = "vless" | "shadowsocks";

type Credentials = {
    id: string;
    ssocksPassword?: string;
}

const logConfig = `
{
    "level": "warn",
    "timestamp": true
}
`;

const dnsConfig = `
{
    "servers": [
        {
            "tag": "cloudflare-dns",
            "address": "https://1.1.1.1/dns-query",
            "detour": "proxy-out"
        },
        {
            "tag": "block-dns",
            "address": "rcode://name_error"
        }
    ]
}
`;

const inboundsConfig = `
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

const getProxyOutboundConfig = (serverName: string, address: string, protocol: Protocol, clientUUID: string, sni: string, publicKey: string, shortId: string) => {
    switch (protocol) {
        case "shadowsocks": {
            const password = getShadowsocksPasswordByClientID(clientUUID);
            if (password === undefined) {
                throw new Error("У вас нет доступа к протоколу Shadowsocks");
            }
            const ssocksMethod = process.env.PROXY_SHADOWSOCKS_METHOD!;
            const ssocksPort = getShadowsocksPortByServerName(serverName);
            return (`{
    "tag": "proxy-out",
    "type": "shadowsocks",
    "server": "${address}",
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
    "server": "${address}",
    "server_port": 443,
    "uuid": "${clientUUID}",
    "flow": "xtls-rprx-vision",
    "tls": {
        "enabled": true,
        "server_name": "${sni}",
        "utls": {
            "enabled": true,
            "fingerprint": "chrome"
        },
        "reality": {
            "enabled": true,
            "public_key": "${publicKey}",
            "short_id": "${shortId}"
        }
    }
}
`);
        }
    }
};

const outboundsConfig = (serverName: string, address: string, protocol: Protocol, clientUUID: string, sni: string, publicKey: string, shortId: string) => (`
[
    {
        "type": "direct",
        "tag": "direct-out"
    },
    ${getProxyOutboundConfig(serverName, address, protocol, clientUUID, sni, publicKey, shortId)},
    {
        "type": "dns",
        "tag": "dns-out"
    }
]
`);

const routeConfig = (includeAntizapret: boolean) => `
{
    "auto_detect_interface": true,
    "rules": [
        ${includeAntizapret ? `{
            "rule_set": "antizapret",
            "outbound": "proxy-out"
        },` : ""}
        {
            "rule_set": "keelfy-custom",
            "outbound": "proxy-out"
        },
        {
            "protocol": "dns",
            "outbound": "dns-out"
        }
    ],
    "rule_set": [
        ${includeAntizapret ? `{
            "tag": "antizapret",
            "type": "remote",
            "format": "binary",
            "url": "https://github.com/savely-krasovsky/antizapret-sing-box/releases/latest/download/antizapret.srs",
            "download_detour": "proxy-out"
        },` : ""}
        {
            "tag": "keelfy-custom",
            "type": "remote",
            "format": "binary",
            "url": "https://github.com/keelfy/sing-box-cfg/blob/main/sulfur-custom.srs?raw=true",
            "download_detour": "proxy-out"
        }
    ]
}
`;

const routeAllConfig = `
{
    "auto_detect_interface": true,
    "rules": [
        {
            "protocol": ["tcp", "udp"],
            "outbound": "proxy-out"
        }
    ],
    "final": "proxy-out"
}
`;
const experimentalConfig = `
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

    const address = getServerIPByServerName(serverName);
    const sni = getSniByServerName(serverName);
    const publicKey = getPublicKeyByServerName(serverName);
    const shortId = getShortIdByServerName(serverName);
    const config = `
    {
        "log": ${logConfig},
        "dns": ${dnsConfig},
        "inbounds": ${inboundsConfig},
        "outbounds": ${outboundsConfig(serverName, address, protocol, sanitizedClientUUID, sni, publicKey, shortId)},
        "route": ${withTunneling ? routeConfig(includeAntizapret) : routeAllConfig},
        "experimental": ${experimentalConfig}
    }
    `;
    return JSON.stringify(JSON.parse(config), null, 2);
}

const getLinkByClientUUID = (serverName: string, address: string, protocol: Protocol, clientUUID: string, sni: string, publicKey: string, shortId: string) => {
    switch (protocol) {
        case 'shadowsocks': {
            const password = getShadowsocksPasswordByClientID(clientUUID);
            if (password === undefined) {
                throw new Error("У вас нет доступа к протоколу Shadowsocks");
            }
            const ssocksMethod = process.env.PROXY_SHADOWSOCKS_METHOD!;
            const ssocksPort = process.env.PROXY_SHADOWSOCKS_PORT!;
            const credentials = Buffer.from(`${ssocksMethod}:${password}`, 'ascii').toString('base64');
            return `ss://${credentials}@${address}:${ssocksPort}?type=tcp#SSOCKS%2B${serverName}`;
        }
        default: {
            return `vless://${clientUUID}@${address}:443?type=tcp&security=reality&pbk=${publicKey}&fp=chrome&sni=${sni}&sid=${shortId}&spx=%2F&flow=xtls-rprx-vision#VLESS%2B${serverName}`
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

    const address = getServerIPByServerName(serverName);
    const sni = getSniByServerName(serverName);
    const publicKey = getPublicKeyByServerName(serverName);
    const shortId = getShortIdByServerName(serverName);
    return getLinkByClientUUID(serverName, address, protocol, sanitizedClientUUID, sni, publicKey, shortId);
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
