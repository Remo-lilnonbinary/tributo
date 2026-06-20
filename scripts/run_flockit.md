# Running a real FLock FLocKit federated round (the "real toolkit" artifact)

`POST /api/federated/run` is a real FedAvg round we run ourselves — instant, demo-safe, and it
shows genuine before/after numbers. This recipe is the heavier, pitch-credibility version: a real
federated **LoRA** fine-tune of a small LLM using **FLock's own FLocKit toolkit**, run locally
with no blockchain, no tokens, no whitelisting. Pre-bake it and demo the captured logs.

> Verified against the FLocKit repo as of June 2026. Smoke-test on the actual demo hardware first;
> the first run downloads ~1–2 GB.

## 1. Install

```bash
git clone https://github.com/FLock-io/FLocKit.git
cd FLocKit
uv sync            # or: pip install -r requirements.txt
```

Needs Python 3.11+, PyTorch 2.x. `trl==0.17.0` is pinned — do not upgrade. On Apple Silicon the
MLX path is used automatically (verify `mlx-lm` is installed). Open models (TinyLlama,
Qwen2.5-0.5B) need no Hugging Face token.

## 2. Build a small UK-tax training set (JSONL, Alpaca format)

`data/tributo.jsonl`, one object per line — 50–200 grounded HMRC-style Q&A rows:

```json
{"instruction": "When must I register for Self Assessment if I started freelancing this year?", "input": "", "output": "Tell HMRC by 5 October following the end of the tax year you need to pay tax for."}
{"instruction": "What is the trading allowance?", "input": "", "output": "You can earn up to £1,000 of trading income tax-free; below that you usually don't need to register."}
```

(Tributo's `app/federated/data.py` is a ready source of grounded Q&A you can expand.)

## 3. Run the real federated round

```bash
FLOCKIT_LOG_FILE=run.log FLOCKIT_LOG_LEVEL=INFO \
python local_tests/run_local_test.py \
  --conf templates/llm_finetuning/configs/llama7b_finetune_mlx.yaml \
  --num_rounds 2 --num_clients 2
```

(The shipped `llama7b_finetune_mlx.yaml` is actually TinyLlama-1.1B-Chat.) The loop is a genuine
FL round: Round 0 baseline → each client trains locally → **FedAvg over the LoRA adapter weights**
→ evaluate → repeat.

### CPU / fastest-laptop overrides

Copy the config and set:

```yaml
model_args.foundation_model_name: Qwen/Qwen2.5-0.5B-Instruct   # smallest, fastest
model_args.finetune_adapter: lora
train_args.proposer_train_optimizer_name: adamw                # QLoRA's 8-bit optim is CUDA-only
train_args.block_size: 512
train_args.proposer_train_micro_batch_size: 1
train_args.proposer_num_epochs: 1
data_args.data_source: local
data_args.data_path: data/tributo.jsonl
```

## 4. Capture the before/after proof

The simulator prints the metric to stdout / `run.log`:

```bash
grep -E "evaluation loss|Best loss" run.log
# [Round 0] Baseline evaluation loss: X.XXX   <- BEFORE
# Best loss: Y.YYY (round r)                  <- AFTER ; Y < X means federated improvement
```

Metric is eval cross-entropy loss from `FlockModel.evaluate()`. Save `run.log` and the trained
adapter; demo those, with at most a tiny optional live re-run. **Never depend on a live training
run mid-pitch.**

## Notes / honest caveats

- This is plain FedAvg over LoRA adapters (no FedProx / secure aggregation).
- `run_local_test.py` shares the dataset across simulated clients. For a true "data stays siloed
  per institution" claim, run separate `main.py` invocations with distinct `data_indices_path`
  shards, or use `FLock-io/FL-Alliance-Client` Pure-FL mode with a different `DATASET=` per process.
- Avoid `make chain/dev/sim` and the on-chain Base-Sepolia path (needs $FLOCK + whitelisting) —
  out of scope for the hackathon.
