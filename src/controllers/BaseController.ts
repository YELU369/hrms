import { AuthRequest } from "@/middlewares/validateToken";
import { ServiceResult } from "@/ServiceResult";
import { Response } from "express";

export class BaseController<CreateDTO, UpdateDTO> {

  protected service: any;
  private entityName: string;

  constructor(service: any) {
    this.service = service;
    this.entityName = this.constructor.name.replace('Controller', '');
  }

  respond(response: Response, result: ServiceResult): void {
    response.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }

  async index(request: AuthRequest, response: Response): Promise<void> {

    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;

    try {
      
      const result = await this.service.getList(request.query, page, limit);
      this.respond(response, ServiceResult.success(`${this.entityName} List`, 200, result));

    } catch (exception) {

      console.log(`${this.entityName} - Index: `, exception);
      this.respond(response, ServiceResult.error('Something went wrong. Please try again later.'));
    }
  }

  async store(request: AuthRequest, response: Response): Promise<void> {

    const data: CreateDTO = request.body;
    const userId = Number(request.user_id);

    try {
      
      await this.service.store(data, userId);
      this.respond(response, ServiceResult.success(`The ${this.entityName} was successfully created.`));
      
    } catch (exception) {

      console.log(`${this.entityName} - Store: `, exception);
      this.respond(response, ServiceResult.error('Something went wrong. Please try again later.'));
    }
  }

  async show(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;

    try {
      
      const result = await this.service.getById(parseInt(id));
      this.respond(response, ServiceResult.success(`${this.entityName} Detail`, 200, result));
      
    } catch (exception) {

      console.log(`${this.entityName} - Show: `, exception);
      this.respond(response, ServiceResult.error('Something went wrong. Please try again later.'));
    }
  }

  async update(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;
    const data: UpdateDTO = request.body;
    const userId = Number(request.user_id);

    try {
      
      await this.service.update(parseInt(id), data, userId);
      this.respond(response, ServiceResult.success(`The ${this.entityName} was successfully updated.`));
      
    } catch (exception) {

      console.log(`${this.entityName} - Update: `, exception);
      this.respond(response, ServiceResult.error('Something went wrong. Please try again later.'));
    }
  }

  async delete(request: AuthRequest, response: Response): Promise<void> {

    const { id } = request.params;

    try {
      
      const result = await this.service.delete(parseInt(id));
      this.respond(response, ServiceResult.success(`The ${this.entityName} was successfully deleted.`));
      
    } catch (exception) {

      console.log(`${this.entityName} - Delete: `, exception);
      this.respond(response, ServiceResult.error('Something went wrong. Please try again later.'));
    }
  }
}
