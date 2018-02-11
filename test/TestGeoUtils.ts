import {GeoUtils, Rectangle} from "../lib/geoutils/GeoUtils" //"../lib/geoutils/GeoUtils"
import { expect } from "chai"
import "mocha"

import { format } from "util";

class TestSearchGrid {
    public static grid: [[number]]
    private static maxResults: number = 0
    
    /**
     * Intialise a TestSearchGrid with a dummy two dimensional array
     * @gridSize The side length of the sqare search grid generated. Should be a power of 2.
     * @maxResults The maximum number of results which can be returned by the SearchGrid function on any one call
     */
    static Initialise(gridSize: number, 
                      maxResults: number, 
                      valueProvider: (i: number, j: number) => number): void {
        let grid = <[any]> new Array(gridSize)
        for ( let i=0; i<gridSize; i++) {
            grid[i] = new Array(gridSize)
            for ( let j=0; j<gridSize; j++) {
                grid[i][j] = valueProvider(i,j)
            }
        }
        TestSearchGrid.grid = grid
        TestSearchGrid.maxResults = maxResults
    }

    async SearchGrid(area: Rectangle) {
        let x1 = area.xmin
        let y1 = area.ymax
        let x2 = area.xmax
        let y2 = area.ymin

        let results = []
        for (let i = x1; i < x2; i++) {
            for (let j = y2; j < y1; j++) {
                results.push(TestSearchGrid.grid[i][j])
            }
        }
        if (results.length > TestSearchGrid.maxResults) {
            results = results.slice(0, TestSearchGrid.maxResults)
        }
        return await <[any]> results
    }
}

describe('GeoUtils RecurseSearch', async function() {
    this.timeout(5000)
    it('Should find all of the values in the test map and sum them. All maps values are 1.', async () => {
      
      let mapgrid = new TestSearchGrid()
      let gridSize = 2**8
      let maxResults = 1000
      let one = () => 1

      TestSearchGrid.Initialise(gridSize, maxResults, one)

      let resultIsLongerThan1000 = (results: [any]) => results.length >= 1000

      let results = <[number]> await GeoUtils.RecurseSearch(
          [{}],
          new Rectangle(0, gridSize, gridSize, 0), /* coords */
          mapgrid.SearchGrid, /* performSearch */
          resultIsLongerThan1000 /* isSearchGranularEnough */)
      
      // sum the array
      let sumOfResults = results.reduce((a, b) => a + b, 0)
      expect(sumOfResults).to.equal( gridSize * gridSize )
    })
})

describe('GeoUtils RecurseSearch', async function() {
    this.timeout(5000)
    it('Should find all of the values in the test map and sum them. All maps values are random.', async () => {
      
        let mapgrid = new TestSearchGrid()
        let gridSize = 2**8
        let maxResults = 1000
        let randBetween0And100 = () => Math.random() * 100

        TestSearchGrid.Initialise(gridSize, maxResults, randBetween0And100)
        let expected = TestSearchGrid.grid.reduce((arr1, arr2) => <[number]> arr1.concat(arr2))
                                          .reduce((elem1,elem2) => elem1 + elem2)

        let resultIsLongerThan1000 = (results: [any]) => results.length >= 1000

        let results = <[number]> await GeoUtils.RecurseSearch(
            [{}],
            new Rectangle(0, gridSize, gridSize, 0), /* coords */
            mapgrid.SearchGrid, /* performSearch */
            resultIsLongerThan1000 /* isSearchGranularEnough */)
        
        // sum the array
        let sumOfResults = results.reduce((elem1,elem2) => elem1 + elem2)
        expect(sumOfResults).to.be.closeTo(expected, 0.01)
    })
})
