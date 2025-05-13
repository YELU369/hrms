import { AppDataSource } from "@/data-source";
import { EmployeeWorkScheduleService } from "@/services/EmployeeWorkScheduleService";
import { OfficeHourService } from "@/services/OfficeHourService";
import { WorkScheduleDetailService } from "@/services/WorkScheduleDetailService";
import { WorkScheduleService } from "@/services/WorkScheduleService";
import { QueryRunner } from "typeorm";

export type WorkScheduleDetailType = {
  day_number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  is_off: boolean;
  work_from: string;
  work_to: string;
}

export type PayloadType = {
  title: string;
  description: string;
  start_from: Date;
  end_to?: Date;
  days: WorkScheduleDetailType[]
}

export class WorkScheduleFacade {

  private officeHourService: OfficeHourService;
  private workScheduleService: WorkScheduleService;
  private workScheduleDetailService: WorkScheduleDetailService;
  private queryRunner: QueryRunner;

  constructor() {
    this.queryRunner = AppDataSource.createQueryRunner();
    this.officeHourService = new OfficeHourService(this.queryRunner.manager);
    this.workScheduleService = new WorkScheduleService(this.queryRunner.manager);
    this.workScheduleDetailService = new WorkScheduleDetailService(this.queryRunner.manager);
  }

  async store(payload: PayloadType, userId: number): Promise<boolean> {

    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      
      const workSchedule = await this.workScheduleService.store(
        {
          title: payload.title, 
          description: payload.description, 
          start_from: payload.start_from, 
          end_to: payload.end_to
        }, 
        userId
      );

      for(const day of payload.days) {

        let officeHour = undefined;

        if (!day.is_off && day.work_from != null && day.work_to != null) {
          officeHour = await this.officeHourService.storeOrNew(
            {
              work_from: day.work_from, 
              work_to: day.work_to, 
            }, 
            {
              work_from: day.work_from, 
              work_to: day.work_to, 
            }, 
            userId
          );
        }

        await this.workScheduleDetailService.store(
          {
            day_number: day.day_number, 
            is_off: day.is_off, 
            schedule: workSchedule, 
            officeHour: officeHour
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