import * as cdk from "@aws-cdk/core";

export class Parameters {
  constructor(private stack: cdk.Stack) {}

  get ecrRepositoryTag(): string {
    const ecrRepositoryTag = new cdk.CfnParameter(
      this.stack,
      `ecrRepositoryTag`,
      {
        type: "String",
        description: "ECR repository tag",
      }
    );
    return ecrRepositoryTag.valueAsString;
  }
}
