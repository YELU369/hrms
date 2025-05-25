import "reflect-metadata"
import { DataSource } from "typeorm"
import { dbconfig } from "./config/database"
import { CheckInRecord } from "./entity/CheckInRecord"
import { CheckOutRecord } from "./entity/CheckOutRecord"
import { Department } from "./entity/Department"
import { DepartmentManager } from "./entity/DepartmentManager"
import { Employee } from "./entity/Employee"
import { EmployeeAddress } from "./entity/EmployeeAddress"
import { EmployeeEmergencyContact } from "./entity/EmployeeEmergencyContact"
import { EmployeeSalary } from "./entity/EmployeeSalary"
import { LeaveBalance } from "./entity/LeaveBalance"
import { LeaveRequest } from "./entity/LeaveRequest"
import { LeaveType } from "./entity/LeaveType"
import { OvertimeRequest } from "./entity/OvertimeRequest"
import { Payroll } from "./entity/Payroll"
import { Position } from "./entity/Position"
import { PositionSalary } from "./entity/PositionSalary"
import { User } from "./entity/User"
import { WorkSchedule } from "./entity/WorkSchedule"
import { WorkScheduleDetail } from "./entity/WorkScheduleDetail"
import { EmailVerification } from "./entity/EmailVerification"
import { BlacklistedToken } from "./entity/BlacklistedToken"
import { EmployeeUser } from "./entity/EmployeeUser"
import { EmployeeWorkSchedule } from "./entity/EmployeeWorkSchedule"
import { OfficeHour } from "./entity/OfficeHour"
import { Holiday } from "./entity/Holiday"

// console.log('DB Config: ', dbconfig);

export const AppDataSource = new DataSource({

    // type: dbconfig.type,
    type: "mysql",
    host: dbconfig.host,
    port: dbconfig.port,
    username: dbconfig.username,
    password: dbconfig.password,
    database: dbconfig.database,

    synchronize: true,
    logging: false,

    entities: [
        User, 
        File, 
        CheckInRecord, 
        CheckOutRecord,
        Department,
        DepartmentManager,
        Employee, 
        File,
        LeaveBalance,
        LeaveRequest,
        LeaveType,
        OvertimeRequest,
        Payroll,
        Position,
        PositionSalary,
        EmployeeAddress,
        EmployeeEmergencyContact,
        EmployeeSalary,
        EmailVerification, 
        WorkSchedule,
        WorkScheduleDetail,
        BlacklistedToken, 
        EmployeeUser, 
        EmployeeWorkSchedule, 
        OfficeHour, 
        Holiday, 
    ],
    migrations: [],
    subscribers: [],
})

