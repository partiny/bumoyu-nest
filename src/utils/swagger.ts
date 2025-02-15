import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function createSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('BUMOYU')
    .setDescription('BUMOYU 接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .setExternalDoc('SwaggerJSON Path', '/swagger-json')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('doc', app, document)
}