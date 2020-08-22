import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ecs from "@aws-cdk/aws-ecs";
import * as batch from "@aws-cdk/aws-batch";
import { Context } from "./Context";
import { Parameters } from "./Parameters";

export class DeployBatch extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const c = Context.fromNode(scope.node);
    const sc = c.fromStack("DeployBatch");
    const p = new Parameters(this);

    const ecrRepository = ecs.ContainerImage.fromEcrRepository(
      ecr.Repository.fromRepositoryName(
        this,
        `${id}-ecr`,
        sc.ecrRepositoryName
      ),
      p.ecrRepositoryTag
    );

    new batch.JobDefinition(this, `${id}-jobDef`, {
      jobDefinitionName: sc.jobDefName,
      retryAttempts: 2,
      timeout: cdk.Duration.seconds(600),
      container: {
        image: ecrRepository,
        vcpus: sc[c.stage].cpu,
        memoryLimitMiB: sc[c.stage].memory,
        environment: {
          STAGE: c.stage,
        },
      },
    });
  }
}
