import { AppDataSource } from '@/data-source';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'unique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {

  async validate(value: any, args: ValidationArguments): Promise<boolean> {

    const [entity, property] = args.constraints;
    const repository = AppDataSource.getRepository(entity);
    const record = await repository.findOne({ where: { [property]: value } });
    
    return !record;
  }

  defaultMessage(args: ValidationArguments) {
    const [entity, property] = args.constraints;
    return `The ${property} already exists.`;
  }
}