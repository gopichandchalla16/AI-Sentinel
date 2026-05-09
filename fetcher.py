import requests

RPC = "https://api.mainnet-beta.solana.com"

def get_transaction(tx_sig):
    """Fetch a Solana transaction by signature"""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [
            tx_sig,
            {
                "encoding": "jsonParsed",
                "maxSupportedTransactionVersion": 0
            }
        ]
    }
    try:
        r = requests.post(RPC, json=payload, timeout=15)
        return r.json()
    except Exception as e:
        return {"error": str(e), "result": None}

def get_wallet_history(address):
    """Get last 5 transactions for a wallet address"""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [address, {"limit": 5}]
    }
    try:
        r = requests.post(RPC, json=payload, timeout=15)
        return r.json()
    except Exception as e:
        return {"error": str(e), "result": []}

def get_wallet_balance(address):
    """Get SOL balance of a wallet"""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [address]
    }
    try:
        r = requests.post(RPC, json=payload, timeout=15)
        data = r.json()
        lamports = data.get("result", {}).get("value", 0)
        return round(lamports / 1_000_000_000, 4)
    except Exception as e:
        return 0
