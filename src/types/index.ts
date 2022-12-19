import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Observable } from 'rxjs';

export interface IUserServiceClient {
  getUserByClientAccountId(data: {
    clientAccountId: string;
  }): Observable<IGetUserByClientAccountIdResponse<IUser>>;
}

export interface GrpcRequestInterface {
  getResponse<R, C, M>(client: C, grpcFunction: string, message: M): Promise<R>;
}

export enum UserType {
  SELLER = 'SELLER',
  CONSUMER = 'CONSUMER',
}

export enum Locales {
  RU = 'RU',
  EN = 'EN',
}

export interface IMailOptions extends ISendMailOptions {
  locale: Locales;
}

export interface IUser {
  id: string;
  clientAccountId: string;
  type: UserType;
  email: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  surname: string;
  userName: string;
  phone: string;
  locale: Locales;
}

export type IGetUserByClientAccountIdResponse<U> = IGetCommonUserResponse<U>;

export type IConsumer = IUser;

export interface ISeller extends IUser {
  company: string;
  setting: ISellerSetting;
}

export interface ISellerSetting {
  id: string;
  tags: string[];
  emails: boolean;
}

export interface Error {
  code: string;
  message: Array<string>;
}

export interface IGetUsersResponse<R> {
  users: R;
  error?: Error;
}

export interface IPageInfo {
  page: number;
  perPage: number;
  totalCount: number;
  totalPageCount: number;
}

export interface IError {
  code: string;
  message: Array<string>;
}

export type CommonIsSuccessResponse = ICommonSuccess | ICommonFailure;

interface ICommonSuccess {
  isSuccess: true;
}

interface ICommonFailure {
  isSuccess: false;
  error: IError;
}

export type GetDataResponseWithPage<D> =
  | ISuccessDataWithPage<D>
  | IFailureDataWithPage;

export type GetDataResponse<D> =
  | Omit<ISuccessDataWithPage<D>, 'pageInfo'>
  | Omit<IFailureDataWithPage, 'pageInfo'>;

interface ISuccessDataWithPage<D> {
  data: D[];
  pageInfo: IPageInfo;
}

interface IFailureDataWithPage {
  data: [];
  pageInfo: IPageInfo;
  error: IError;
}

export interface IGetCommonUserResponse<U> {
  user: U;
  error?: IError;
}
