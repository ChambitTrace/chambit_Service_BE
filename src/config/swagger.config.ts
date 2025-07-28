import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Swagger 문서 생성을 위한 기본 설정
 */
export class SwaggerConfig {
  // NestJs 자동 생성 태그 제외
  private static readonly AUTO_GENERATED_TAGS = ['App'];
  private static readonly HTTP_METHODS = [
    'get',
    'post',
    'put',
    'delete',
    'patch',
    'options',
    'head',
  ];
  private static readonly SWAGGER_JSON_FILENAME = 'swagger-spec.json';

  static createConfig() {
    // 패키지 버전 가져오기
    let version = '1.0.0';
    try {
      const packageJsonPath = join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      version = packageJson.version;
    } catch (error) {
      console.warn(
        'package.json 파일을 찾을 수 없습니다. 기본 버전을 사용합니다.',
        version,
      );
    }

    return new DocumentBuilder()
      .setTitle('KRSS - Chambit BE 서버')
      .setDescription('KRSS - Chambit API 문서')
      .setVersion(version)
      .addBearerAuth()
      .build();
  }

  /**
   * Swagger 문서 생성 옵션
   */
  static getDocumentOptions() {
    return {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
      ignoreGlobalPrefix: true,
      deepScanRoutes: true,
    };
  }

  /**
   * 명시적으로 태그가 설정된 API만 필터링
   * NestJs 자동 생성 태그 제외
   */
  static filterPathsWithExplicitTags(document: OpenAPIObject): OpenAPIObject {
    const filteredTags = {};

    for (const [path, pathItem] of Object.entries(document.paths)) {
      const filteredPathItem = {};

      for (const [method, operation] of Object.entries(pathItem)) {
        if (!this.HTTP_METHODS.includes(method.toLowerCase())) {
          continue;
        }

        if (typeof operation === 'object' && operation !== null) {
          if (
            'tags' in operation &&
            operation.tags &&
            Array.isArray(operation.tags) &&
            operation.tags.length > 0
          ) {
            const hasExplicitTag = operation.tags.some(
              (tag) => !this.AUTO_GENERATED_TAGS.includes(tag),
            );

            if (hasExplicitTag) {
              operation.tags = operation.tags.filter(
                (tag) => !this.AUTO_GENERATED_TAGS.includes(tag),
              );
              filteredPathItem[method] = operation;
            }
          }
        }
      }

      if (Object.keys(filteredPathItem).length > 0) {
        filteredTags[path] = filteredPathItem;
      }
    }

    return {
      ...document,
      paths: filteredTags,
    };
  }

  /**
   * Swagger 문서 설정
   */
  static setup(app: INestApplication, extraModels: any[] = []) {
    const config = this.createConfig();
    const options = this.getDocumentOptions();

    const document = SwaggerModule.createDocument(app, config, {
      ...options,
      extraModels,
    });

    // 명시적으로 태그가 설정된 API만 필터링
    const filteredDocument = this.filterPathsWithExplicitTags(document);

    // Swagger JSON 파일 자동 생성
    this.generateSwaggerJson(filteredDocument);

    SwaggerModule.setup('api', app, filteredDocument);

    return filteredDocument;
  }

  /**
   * Swagger JSON 파일 생성
   */
  private static generateSwaggerJson(document: OpenAPIObject) {
    try {
      const swaggerJsonPath = join(process.cwd(), this.SWAGGER_JSON_FILENAME);
      writeFileSync(swaggerJsonPath, JSON.stringify(document, null, 2));
      console.log(`✅ Swagger JSON 파일이 생성되었습니다: ${swaggerJsonPath}`);
    } catch (error) {
      console.error('❌ Swagger JSON 파일 생성 중 오류가 발생했습니다.', error);
    }
  }
}
