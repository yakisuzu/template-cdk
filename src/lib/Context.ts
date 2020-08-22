import * as cdk from "@aws-cdk/core";

const stages = ["local", "dev", "stg", "prd"];
// TODO stagesから型を抽出する
type Stage = "local" | "dev" | "stg" | "prd";
type Ec2StageContext = {
  cpu: number;
  memory: number;
};
type DeployBatchContext = {
  ecrRepositoryName: string;
  jobDefName: string;
} & Record<Stage, Ec2StageContext>;
type StackContext = {
  DeployBatch: DeployBatchContext;
  [key: string]: Record<string, unknown>;
};

export class Context {
  constructor(
    readonly systemPrefix: string,
    readonly systemName: string,
    readonly stage: Stage,
    private stack: StackContext,
    readonly accountId: string
  ) {}

  toStackName(name: string): string {
    return [this.systemPrefix, this.systemName, this.stage, name]
      .filter((s) => s)
      .join("-");
  }

  fromStack<T extends keyof StackContext>(stackName: T): StackContext[T] {
    const sc = this.stack[stackName] || {};
    if (stages.some((stage) => !sc[stage])) {
      throw new Error("contextのStackで、stage定義が網羅されていません");
    }
    return sc;
  }

  toJsonString(): string {
    return JSON.stringify(this, null, 2);
  }

  static fromNode(node: cdk.ConstructNode): Context {
    return new Context(
      node.tryGetContext("systemPrefix") || "",
      node.tryGetContext("systemName") || "",
      stageFromContext(node.tryGetContext("stage")),
      node.tryGetContext("Stack") || {},
      process.env.CDK_DEFAULT_ACCOUNT || ""
    );
  }
}

function stageFromContext(stage?: string): Stage {
  switch (stage) {
    case "prd":
    case "stg":
    case "dev":
      return stage;
    default:
      return "local";
  }
}
