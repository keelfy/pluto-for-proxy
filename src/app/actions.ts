"use server";

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

const getProxyOutboundConfig = (server: string, clientUUID: string, serverName: string, publicKey: string, shortId: string) => (`
{
    "tag": "proxy-out",
    "type": "vless",
    "server": "${server}",
    "server_port": 443,
    "uuid": "${clientUUID}",
    "flow": "xtls-rprx-vision",
    "tls": {
        "enabled": true,
        "server_name": "${serverName}",
        "utls": {
            "enabled": true
        },
        "reality": {
            "enabled": true,
            "public_key": "${publicKey}",
            "short_id": "${shortId}"
        }
    }
}
`);

const outboundsConfig = (server: string, clientUUID: string, serverName: string, publicKey: string, shortId: string) => (`
[
    {
        "type": "direct",
        "tag": "direct-out"
    },
    ${getProxyOutboundConfig(server, clientUUID, serverName, publicKey, shortId)},
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

function validateClientUUID(clientUUID: string) {
    const allowedClientUUIDs = process.env.PROXY_ALLOWED_CLIENT_UUIDS!.split(",").map(clearUUID);
    return allowedClientUUIDs.includes(clearUUID(clientUUID));
}

export async function getConfigWithTunnelingByClientUUID(clientUUID: string, includeAntizapret: boolean = true) {
    const sanitizedClientUUID = clearUUID(clientUUID);
    if (!validateClientUUID(sanitizedClientUUID)) {
        throw new Error("Клиент не найден");
    }

    const server = process.env.PROXY_SERVER!;
    const serverName = process.env.PROXY_TLS_SERVER_NAME!;
    const publicKey = process.env.PROXY_TLS_PUBLIC_KEY!;
    const shortId = process.env.PROXY_TLS_SHORT_ID!;
    const config = `
    {
        "log": ${logConfig},
        "dns": ${dnsConfig},
        "inbounds": ${inboundsConfig},
        "outbounds": ${outboundsConfig(server, sanitizedClientUUID, serverName, publicKey, shortId)},
        "route": ${routeConfig(includeAntizapret)},
        "experimental": ${experimentalConfig}
    }
    `;
    return JSON.stringify(JSON.parse(config), null, 2);
}

const getLinkByClientUUID = (server: string, clientUUID: string, serverName: string, publicKey: string, shortId: string) => `
vless://${clientUUID}@${server}:443?type=tcp&security=reality&pbk=${publicKey}&fp=chrome&sni=${serverName}&sid=${shortId}&spx=%2F&flow=xtls-rprx-vision#jade.keelfy.dev
`;

export async function getLinkWithTunnelingByClientUUID(clientUUID: string) {
    const sanitizedClientUUID = clearUUID(clientUUID);
    if (!validateClientUUID(sanitizedClientUUID)) {
        throw new Error("Клиент не найден");
    }
    const server = process.env.PROXY_SERVER!;
    const serverName = process.env.PROXY_TLS_SERVER_NAME!;
    const publicKey = process.env.PROXY_TLS_PUBLIC_KEY!;
    const shortId = process.env.PROXY_TLS_SHORT_ID!;
    return getLinkByClientUUID(server, sanitizedClientUUID, serverName, publicKey, shortId);
}
