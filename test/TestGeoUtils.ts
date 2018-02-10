import {GeoUtils} from "../lib/geoutils/GeoUtils"
import { expect } from "chai"
import "mocha"

import { format } from "util";

class TestSearchGrid {
    private grid: [number]
    private maxResults: number = 0
    
    /**
     * Intialise a TestSearchGrid with a dummy two dimensional array
     * @gridSize The side length of the sqare search grid generated. Should be a power of 2.
     * @maxResults The maximum number of results which can be returned by the SearchGrid function on any one call
     */
    Initialise(gridSize, maxResults): void {
        let grid = <[number]> Array.prototype.fill(Array.prototype.fill(1, 0, gridSize))
        this.grid = grid
    }

    async SearchGrid(x1: number, y1: number, x2: number, y2: number) {
        let results = []
        for (let i = x1; i <= x2; i++) {
            for (let j = y1; j <= y2; j++) {
                results.push(this.grid[i][j])
            }
        }
        if (results.length > this.maxResults) {
            results = results.slice(0, this.maxResults-1)
        }
        return await <[any]> results
    }
}

describe('GeoUtils GridSearch', async function() {
    this.timeout(5000)
    it('Should get a 52 char session token and 88 char secret.', async () => {
      
      let mapgrid = new TestSearchGrid()
      let gridSize = 2**16
      let maxResults = 1000
      mapgrid.Initialise(gridSize, maxResults)

      let isResultShorterThan1000 = function(results: [any]): Boolean {
        return results.length > 1000
      }

      let results = <[number]> await GeoUtils.GridSearch(
          0, gridSize, 0, gridSize, /* coords */
          mapgrid.SearchGrid, /* performSearch */
          isResultShorterThan1000 /* isSearchGranularEnough */)
      
      // sum the array
      let sumOfResults = results.reduce((a, b) => a + b, 0)
      expect(sumOfResults).to.equal( gridSize * gridSize )
    })
  })