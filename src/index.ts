#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { DeployBatch } from "./lib/DeployBatch";
import { Context } from "./lib/Context";

const app = new cdk.App();
const c = Context.fromNode(app.node);
console.log("Context", c.toJsonString());

new DeployBatch(app, c.toStackName("DeployBatch"));
