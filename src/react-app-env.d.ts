/// <reference types="react-scripts" />
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
interface a{
    page:number
}
