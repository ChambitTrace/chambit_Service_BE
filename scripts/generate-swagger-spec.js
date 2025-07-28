#!/usr/bin/env node

const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { writeFileSync } = require('fs');
const { join } = require('path');

/**
 * 앱을 실행하지 않고 Swagger JSON 스펙을 생성하는 스크립트
 */
async function generateSwaggerSpec() {
    console.log('🚀 Swagger JSON 스펙 생성을 시작합니다...');

    try {
        // AppModule을 동적으로 로드
        const { AppModule } = require('../dist/src/app.module.js');
        
        // NestJS 앱 생성 (서버 시작 없이)
        const app = await NestFactory.create(AppModule, {
            logger: false, // 로그 비활성화
            abortOnError: false
        });

        // Swagger 설정
        const config = new DocumentBuilder()
            .setTitle('KRSS - Chambit BE 서버')
            .setDescription('KRSS - Chambit API 문서')
            .setVersion('1.0.0')
            .addBearerAuth()
            .build();

        const documentOptions = {
            operationIdFactory: (controllerKey, methodKey) => methodKey,
            ignoreGlobalPrefix: true,
            deepScanRoutes: true,
        };

        // Swagger 문서 생성
        const document = SwaggerModule.createDocument(app, config, documentOptions);

        // 자동 생성된 태그 필터링 (선택적)
        const filteredDocument = filterExplicitTags(document);

        // JSON 파일로 저장
        const outputPath = join(process.cwd(), 'swagger-spec.json');
        writeFileSync(outputPath, JSON.stringify(filteredDocument, null, 2));

        console.log(`✅ Swagger JSON 스펙이 생성되었습니다: ${outputPath}`);

        // 앱 종료
        await app.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Swagger JSON 스펙 생성 중 오류가 발생했습니다:', error.message);
        process.exit(1);
    }
}

/**
 * 명시적으로 태그가 설정된 API만 필터링
 */
function filterExplicitTags(document) {
    const AUTO_GENERATED_TAGS = ['App'];
    const filteredPaths = {};

    for (const [path, pathItem] of Object.entries(document.paths)) {
        const filteredPathItem = {};

        for (const [method, operation] of Object.entries(pathItem)) {
            const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
            if (!httpMethods.includes(method.toLowerCase())) {
                continue;
            }

            if (typeof operation === 'object' && operation !== null) {
                if ('tags' in operation && operation.tags && Array.isArray(operation.tags) && operation.tags.length > 0) {
                    const hasExplicitTags = operation.tags.some(tag => !AUTO_GENERATED_TAGS.includes(tag));

                    if (hasExplicitTags) {
                        operation.tags = operation.tags.filter(tag => !AUTO_GENERATED_TAGS.includes(tag));
                        filteredPathItem[method] = operation;
                    }
                }
            }
        }

        if (Object.keys(filteredPathItem).length > 0) {
            filteredPaths[path] = filteredPathItem;
        }
    }

    return {
        ...document,
        paths: filteredPaths,
    };
}

// 스크립트 실행
if (require.main === module) {
    generateSwaggerSpec();
}

module.exports = { generateSwaggerSpec };