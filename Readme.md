# langchain-storacha-ensemble

Ensemble learning for LangChain agents with Storacha decentralized storage.

## Overview

This package enables collaborative AI by combining LangChain agents with Storacha's decentralized storage for ensemble learning. It allows multiple AI agents to share their inputs, outputs, and reasoning chains, leading to more robust and transparent decision-making.

## Installation


## Features

- **Agent Execution with Persistent Storage**: Run LangChain agents and automatically store their inputs, outputs, and reasoning chains to Storacha
- **Ensemble Learning**: Aggregate results from multiple AI agents using different voting strategies
- **Knowledge Sharing**: Enable agents to access and build upon each other's reasoning
- **Decentralized Memory**: Create a persistent, decentralized memory using Storacha

## Quick Start


## API Reference

### `StorachaAgentWrapper`

Wraps LangChain agents to log their execution data to Storacha.


### `EnsembleManager`

Collects and aggregates results from multiple agents.


### `StorachaClient`

Handles communication with Storacha's decentralized storage.


## Configuration

### StorachaConfig


### EnsembleConfig


## Environment Variables

Create a `.env` file based on the provided `.env.example`:


## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.