import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService

) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('auth.service:create');

    try{
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10),
        ...userData
      })

      await newUser.save();
      const { password:_, ...user } = newUser.toJSON();

      return user;

    }catch (error){
      if( error.code === 11000 ){
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }

  }

  async login( loginDto: LoginDto){
    console.log('auth.service:login');

    const { email, password } = loginDto;

    const user = await this.userModel.findOne({email});

    if( !user ){
      throw new UnauthorizedException('Not valid credentials! - email');
    }

    if( !bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials! - password');
    }

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwToken({ id: user.id })
    };

  }


  findAll() {
    return `This action returns all auth + jmarquina 12012025`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwToken( payload: JwtPayload){
    const token = this.jwtService.sign( payload );
    return token;

  }

}
