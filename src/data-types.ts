export interface GraphItemValue {
    time: number,
    value: number
    timeDescription: string
}

export interface GraphItem {
    itemName: string,
    values: GraphItemValue[],
    width?: number | string
}