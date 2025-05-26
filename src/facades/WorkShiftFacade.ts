import { AppDataSource } from "@/data-source";
import { WorkShiftDetailService } from "@/services/WorkShiftDetailService";
import { WorkShiftService } from "@/services/WorkShiftService";
import { QueryRunner } from "typeorm";

export type WorkShiftDetailType = {
  id?: number;
  employee_id: number;
}

export type PayloadType = {
  id?: number;
  start_from: Date;
  end_to?: Date;
  work_schedule_id: number;
  details: WorkShiftDetailType[]
}

export class WorkShiftFacade {

  private workShiftDetailService: WorkShiftDetailService;
  private workShiftService: WorkShiftService;
  private queryRunner: QueryRunner;

  constructor() {
    this.queryRunner = AppDataSource.createQueryRunner();
    this.workShiftDetailService = new WorkShiftDetailService(this.queryRunner.manager);
    this.workShiftService = new WorkShiftService(this.queryRunner.manager);
  }

  async store(payload: PayloadType, userId: number): Promise<boolean> {

    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      
      const workShift = await this.workShiftService.store(
        {
          start_from: payload.start_from, 
          end_to: payload.end_to, 
          work_schedule_id: payload.work_schedule_id
        }, 
        userId
      );

      for(const employee of payload.details) {

        await this.workShiftDetailService.store(
          {
            employee_id: employee.employee_id, 
            workshift: workShift, 
          }, 
          userId
        );
      }

      await this.queryRunner.commitTransaction();
      return true;

    } catch (exception) {

      this.queryRunner.rollbackTransaction();
      throw exception;

    } finally {

      await this.queryRunner.release();
    }
  }

  async update(id: number, payload: PayloadType, userId: number): Promise<boolean> {

    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      
    const workShift = await this.workShiftService.update(
        id, 
        {
          start_from: payload.start_from, 
          end_to: payload.end_to, 
          work_schedule_id: payload.work_schedule_id
        }, 
        userId
      );

      this.workShiftDetailService.deleteBy({ work_shift_id: workShift.id });

      for(const employee of payload.details) {
        
        await this.workShiftDetailService.store(
          {
            employee_id: employee.employee_id, 
            workshift: workShift, 
          }, 
          userId
        );
      }

      await this.queryRunner.commitTransaction();
      return true;

    } catch (exception) {

      this.queryRunner.rollbackTransaction();
      throw exception;

    } finally {

      await this.queryRunner.release();
    }
  }
}