import streamlit as st
import json
from fetcher import get_transaction, get_wallet_history, get_wallet_balance
from analyzer import analyze

st.set_page_config(
    page_title="AI-Sentinel | Solana Security",
    page_icon="🛡️",
    layout="centered"
)

# Solana-themed dark UI
st.markdown("""
<style>
.stApp { background-color: #0d0d0d; color: #ffffff; }
h1 { color: #14F195 !important; }
h2, h3 { color: #9945FF !important; }
.stTextInput input {
    background-color: #1a1a1a !important;
    color: white !important;
    border: 1px solid #9945FF !important;
}
.stButton > button {
    background-color: #9945FF !important;
    color: white !important;
    border: none !important;
    font-weight: bold !important;
}
.stButton > button:hover {
    background-color: #14F195 !important;
    color: black !important;
}
</style>
""", unsafe_allow_html=True)

# Header
st.title("🛡️ AI-Sentinel")
st.subheader("Real-time Solana Transaction Security Guard")
st.markdown("""
Paste any Solana **transaction signature** below to get an instant 
AI-powered risk analysis — before you sign anything.
""")

st.divider()

# Input
tx_input = st.text_input(
    "🔍 Transaction Signature",
    placeholder="Paste Solana transaction signature here...",
    help="Find any transaction on solscan.io, copy the signature, and paste it here"
)

col1, col2 = st.columns([1, 3])
with col1:
    analyze_btn = st.button("⚡ Analyze Risk", type="primary", use_container_width=True)
with col2:
    st.caption("Powered by Solana RPC + Google Gemini AI")

# Analysis
if analyze_btn:
    if not tx_input.strip():
        st.warning("⚠️ Please paste a transaction signature first.")
    else:
        with st.spinner("🔗 Fetching live on-chain data from Solana mainnet..."):
            tx_data = get_transaction(tx_input.strip())

        if tx_data.get("result") is None:
            st.error("❌ Transaction not found. Please check the signature and try again.")
            st.info("💡 Tip: Get a real transaction signature from [solscan.io](https://solscan.io)")
        else:
            # Extract destination wallet
            try:
                keys = tx_data["result"]["transaction"]["message"]["accountKeys"]
                dest = keys[1]["pubkey"] if len(keys) > 1 else keys[0]["pubkey"]
            except Exception:
                dest = None

            # Fetch wallet data
            with st.spinner("📊 Analyzing wallet history and balance..."):
                wallet_history = get_wallet_history(dest) if dest else {}
                balance = get_wallet_balance(dest) if dest else 0

            # Show wallet info
            if dest:
                col_a, col_b = st.columns(2)
                with col_a:
                    st.metric("Destination Wallet Balance", f"{balance} SOL")
                with col_b:
                    hist_count = len(wallet_history.get("result", []))
                    st.metric("Recent Transactions Found", hist_count)

            # Run AI analysis
            with st.spinner("🤖 Running AI security analysis with Gemini..."):
                result = analyze(tx_data, wallet_history, balance)

            st.divider()
            st.subheader("🔎 Security Analysis Result")

            # Display result with appropriate alert level
            if "CRITICAL" in result:
                st.error(f"🚨 {result}")
            elif "HIGH" in result:
                st.warning(f"⚠️ {result}")
            elif "MEDIUM" in result:
                st.info(f"⚡ {result}")
            else:
                st.success(f"✅ {result}")

            # Raw data expander
            with st.expander("📦 View Raw On-Chain Data"):
                st.json(tx_data)

st.divider()

# Footer
st.markdown("""
<div style='text-align:center; color:#444; font-size:12px;'>
🛡️ AI-Sentinel | Colosseum Frontier Hackathon 2026 |
Open Source MIT | Built on Solana
</div>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.header("🛡️ AI-Sentinel")
    st.markdown("""
    ### How it works
    1. Paste a transaction signature
    2. We fetch live Solana on-chain data
    3. Gemini AI analyzes risk factors
    4. You get a plain-English verdict

    ### Risk Levels
    - ✅ **LOW** — Safe to proceed
    - ⚡ **MEDIUM** — Review carefully
    - ⚠️ **HIGH** — Caution advised
    - 🚨 **CRITICAL** — Do NOT sign

    ### What we check
    - Destination wallet age
    - Wallet SOL balance
    - Transaction type & amounts
    - Suspicious program calls
    - Known exploit patterns

    ### Built with
    - Solana JSON-RPC API
    - Google Gemini 1.5 Flash
    - Python + Streamlit
    
    ### Team
    Gopichand | Kaviya | Kalisetty
    """)
    st.divider()
    st.caption("Colosseum Frontier Hackathon 2026 🏔️")
