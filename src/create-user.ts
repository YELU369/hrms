import 'dotenv/config';
import inquirer from 'inquirer';
import { AppDataSource } from './data-source';
import { UserRegisterDTO } from './DTOs/UserRegisterDTO';
import { UserService } from './services/UserService';
import { plainToInstance } from 'class-transformer';

const promptUserDetails = async () => {
  return inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Enter your name:',
      validate: (input: string) => input.trim() !== '' || 'Name is required.',
    },
    {
      name: 'email',
      type: 'input',
      message: 'Enter your email:',
      validate: (input: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || 'Enter a valid email address.',
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter a password:',
      mask: '*',
      validate: (input: string) => input.length >= 6 || 'Password must be at least 6 characters.',
    },
    {
      name: 'password_confirmation',
      type: 'password',
      message: 'Confirm password:',
      mask: '*',
      validate: (input: string) => input.length >= 6 || 'Password must be at least 6 characters.',
    },
  ]);
};

const createUser = async () => {
  await AppDataSource.initialize();

  const answers = await promptUserDetails();
  console.clear();
  
  if (answers.password != answers.password_confirmation) {
    console.error('Password did not match!');
    process.exit(1);
  }

  const userDTO = plainToInstance(
    UserRegisterDTO, 
    {
      name: answers.name, 
      email: answers.email, 
      password: answers.password, 
    }, 
    { excludeExtraneousValues: true }
  );

  const result = await UserService.register(userDTO);
  
  if (result.success) {
    console.log(result.message);
    process.exit(0);
  } else {
    console.error(result.message);
    process.exit(1);
  }
};

createUser().catch(error => {
  console.error('Error creating user:', error);
  process.exit(1);
});
