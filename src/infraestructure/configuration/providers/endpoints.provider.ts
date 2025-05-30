import { Injectable, DynamicModule, Type } from '@nestjs/common';
import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import * as path from 'path';
import * as glob from 'glob';

@Injectable()
export class EndpointDiscoveryService {
  static async register(): Promise<DynamicModule> {
    const endpointsPaths = path.join(
      __dirname,
      '../../../infraestructure/features/{commands,queries,controllers}/**/',
      '*.endpoint.js',
    );
    const endpointFiles: string[] = glob.sync(endpointsPaths, {
      windowsPathsNoEscape: true,
    });

    const controllers = await Promise.all(
      endpointFiles.map(async (file) => {
        try {
          const importedModule: unknown = await import(file);

          if (this.isValidModule(importedModule)) {
            for (const exportedName in importedModule) {
              const exported = importedModule[exportedName];

              if (this.isEndpointResolver(exported)) {
                return exported;
              }
            }
          }
        } catch (error) {
          console.error(`Error al cargar el archivo ${file}:`, error);
        }
        return null;
      }),
    );

    const validControllers = controllers.filter(
      (controller) => controller !== null,
    );

    return {
      module: EndpointDiscoveryService,
      controllers: validControllers,
    };
  }

  private static isValidModule(
    module: unknown,
  ): module is Record<string, Type<unknown>> {
    return module !== null && typeof module === 'object';
  }

  private static isEndpointResolver(
    target: unknown,
  ): target is Type<RequestResolver<unknown, unknown>> {
    return (
      typeof target === 'function' &&
      target.prototype instanceof RequestResolver
    );
  }
}
