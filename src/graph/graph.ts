import { bindable } from 'aurelia-framework'
import { TIMESHIFT } from './../values'
import { GraphItem } from './../data-types'

const max = (...a: number[]): number => {
    let highest = Number.NEGATIVE_INFINITY

    a.forEach(b => {
        highest = b > highest ? b : highest }
    )
    return highest
}
const getHighestValue = (data: GraphItem[]) => {
    return max(...data.map(graphItem => graphItem.values.reduce((prev, current) => max(prev, current.value), 0)))
}
// const findWidth = ()

export class Graph {
    @bindable data: GraphItem[]
    timeShiftController: number
    time = 1214850600000
    _FULLWIDTH: number = null

    get FULLWIDTH() { return this._FULLWIDTH }
    set FULLWIDTH(value) {
        if (!this._FULLWIDTH) {
            this._FULLWIDTH = value
        } else {
            throw "FULLWIDTH is a one-time-set constant. Can't change the value of it after first time"
        }
    }
    
    bind(bindingContext: Object, overrideContext: Object) {
        this.FULLWIDTH = getHighestValue(this.data);
        this.timeShiftController = window.setInterval(() => {
            this.time += TIMESHIFT
            if (this.time >= Date.now()) {
                window.clearInterval(this.timeShiftController)
            }
            for (let graphItem of this.data) {
                graphItem.width = this.width(this.getValue(graphItem.itemName))
                // console.log(graphItem.width)
            }
        }, 1000)
        console.log(this.width(2498000000), this.FULLWIDTH, 2498000000 / this.FULLWIDTH)
        this.test();
    }

    test() {
        this.data.forEach(graphItem => {
            console.log(graphItem)
            // console.log(graphItem.values.map(valueItem => valueItem.time))
            // console.log(new Set(graphItem.values.map(valueItem => valueItem.time)))
        })
    }

    getValue(itemName: string): number {
        let selectedItem: GraphItem = null;
        for (let item of this.data) {
            if (item.itemName == itemName) {
                selectedItem = item
                break;
            }
        }

        for (let valueItem of selectedItem.values) {
            // console.log(valueItem)
            if (valueItem.time == this.time) {
                return valueItem.value
            }
        }
    }

    width(value: number): string {
        return ((value / this.FULLWIDTH) * 100).toFixed(2);
    }
}