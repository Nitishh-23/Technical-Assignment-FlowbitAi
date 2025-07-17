# Flowbit Technical Challenge

This project is a multi-tenant slice that demonstrates tenant-aware authentication, RBAC, data isolation, and a full workflow round-trip with n8n.

## Core Requirements Implemented
- **R1:** Tenant-aware JWT Authentication & RBAC.
- **R2:** Strict tenant data isolation in MongoDB, with a Jest test to prove it.
- **R3:** A hard-coded Use-Case Registry (`registry.json`) to drive navigation.
- **R4:** A React shell that lazy-loads a remote micro-frontend using Webpack Module Federation.
- **R5:** A full workflow round-trip: API triggers n8n, which calls back to the API using a secured webhook.
- **R6:** Fully containerized development environment using `docker-compose`.

---

## Simple Architecture Diagram