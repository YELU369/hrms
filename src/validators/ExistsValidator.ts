import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { AppDataSource } from '@/data-source';

@ValidatorConstraint({ async: true })
export class ExistsValidator implements ValidatorConstraintInterface {

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [EntityClass, field = 'id'] = args.constraints;
    const repo = AppDataSource.getRepository(EntityClass);

    const exists = await repo.findOne({ where: { [field]: value } });
    return !!exists;
  }

  defaultMessage(args: ValidationArguments) {
    const [EntityClass, field = 'id'] = args.constraints;
    return `The selected value does not exist.`;
  }
}
