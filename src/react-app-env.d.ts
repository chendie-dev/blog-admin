/*
 * @Author: chendie chendie
 * @Date: 2023-04-09 09:25:14
 * @LastEditors: chendie chendie
 * @LastEditTime: 2023-05-07 09:32:39
 * @FilePath: /blog-admin/src/react-app-env.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}
declare module 'md-editor-rt';
declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
    const src: string;
    export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.ts'
interface MenuItem {
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
}
interface BreadcrumbItem {
    title: string | JSX.Element,
    menu?: {items:menuItems[]},
}
interface MenuItems {
    key: string,
    label: JSX.Element
}

interface ValidateReturn{
  validateStatus: ValidateStatus;
  errorMsg: string | null;
}
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
interface validateValType{
  value: string;
  validateStatus?: ValidateStatus;
  errorMsg?: string | null;
}