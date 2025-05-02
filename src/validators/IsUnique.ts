import { AppDataSource } from '@/data-source';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsUnique', async: true })
export class IsUnique implements ValidatorConstraintInterface {

  async validate(value: any, args: ValidationArguments): Promise<boolean> {

    const [entity, column, currentIdField, currentId] = args.constraints;
    const repository = AppDataSource.getRepository(entity);
    const record = await repository.findOne({ [column]: value });

    return !(record && record[currentIdField] != currentId);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} is already taken.`;
  }
}