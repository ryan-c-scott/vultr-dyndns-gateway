# Overview
The primary intention of this service is to provide a limited access API key for `Vultr`, as well as to function as a `DynDNS` server.

# Setup

    environment:
        - API_KEY=
        - SUBDOMAIN=

`API_KEY` is your Vultr API key. Keep this as safe as you can.
`SUBDOMAIN` [default: `dyndns`] is the subdomain appended to the `host` provided in the call.

Entries that do not exist will be ignored, so it will be necessary to create your dynamic entries ahead of time. This is a minor security precaution.
*Note: You can enter the whole portion as `host.subdomain` in the Vultr web interface*

# Usage
The `GET` API is based on DynDNS for maximum compatibility with routers and other likely DDNS clients.

Basic HTTP auth is something necessary for the user to provide and it is recommended both do that and reverse proxying with HTTPS to this service.

*`GET` Request Parameters*
`domain` specifies the base domain you have setup as your DNS in Vultr (eg. `example.org`)
`host` is the name of the host entry, without the `SUBDOMAIN` part (eg. `remote`)
`ip` is the IPV4 address to update the entry with

The FQDN as set by the gateway in Vultr will be `HOST.SUBDOMAIN.DOMAIN`

## Example
```
curl "http://localhost:8080/update?domain=example.org&host=test&ip=1.2.3.4"
```

The resultant FQDN would be `test.dyndns.example.org` with IP 1.2.3.4

