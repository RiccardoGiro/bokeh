import {expect} from "chai"

import {StaticLayoutProvider} from "models/graphs/static_layout_provider"
import {ColumnDataSource} from "models/sources/column_data_source"

describe("StaticLayoutProvider", () => {

  describe("default props", () => {

    it("should create an empty dict", () => {
      const layout_provider = new StaticLayoutProvider()
      expect(layout_provider.graph_layout).to.be.deep.equal({})
    })
  })

  describe("graph component layout methods", () => {
    let layout_provider: StaticLayoutProvider

    before(() => {
      layout_provider = new StaticLayoutProvider({
        graph_layout: {0: [-1, 0], 1: [0, 1], 2: [1, 0], 3: [0, -1]},
      })
    })

    describe("get_node_coordinates method", () => {

      it("should return node coords if exist", () => {
        const node_source = new ColumnDataSource()
        node_source.data.index = [0,1,2,3]

        const [xs, ys] = layout_provider.get_node_coordinates(node_source)
        expect(xs).to.be.deep.equal([-1,0,1,0])
        expect(ys).to.be.deep.equal([0,1,0,-1])
      })

      it("should return NaNs if coords don't exist", () => {
        const node_source = new ColumnDataSource()
        node_source.data.index = [4,5,6]

        const [xs, ys] = layout_provider.get_node_coordinates(node_source)
        expect(xs).to.be.deep.equal([NaN, NaN, NaN])
        expect(ys).to.be.deep.equal([NaN, NaN, NaN])
      })
    })

    describe("get_edge_coordinates method", () => {

      it("should return edge coords if exist", () => {
        const edge_source = new ColumnDataSource()
        edge_source.data.start = [0,0,0]
        edge_source.data.end = [1,2,3]

        const [xs, ys] = layout_provider.get_edge_coordinates(edge_source)
        expect(xs).to.be.deep.equal([ [ -1, 0 ], [ -1, 1 ], [ -1, 0 ] ])
        expect(ys).to.be.deep.equal([ [ 0, 1 ], [ 0, 0 ], [ 0, -1 ] ])
      })

      it("should return explicit edge coords if exist", () => {
        const edge_source = new ColumnDataSource()
        edge_source.data.start = [0,0,0]
        edge_source.data.end = [1,2,3]
        edge_source.data.xs = [ [ -1, -0.5, 0 ], [ -1, 0, 1 ], [ -1, -0.5, 0 ] ]
        edge_source.data.ys = [ [ 0, 0.5, 1 ], [ 0, 0, 0 ], [ 0, -0.5, -1 ] ]

        const [xs, ys] = layout_provider.get_edge_coordinates(edge_source)
        expect(xs).to.be.deep.equal([ [ -1, -0.5, 0 ], [ -1, 0, 1 ], [ -1, -0.5, 0 ] ])
        expect(ys).to.be.deep.equal([ [ 0, 0.5, 1 ], [ 0, 0, 0 ], [ 0, -0.5, -1 ] ])
      })

      it("should return NaNs if coords don't exist", () => {
        const edge_source = new ColumnDataSource()
        edge_source.data.start = [4,4,4]
        edge_source.data.end = [5,6,7]

        const [xs, ys] = layout_provider.get_edge_coordinates(edge_source)
        expect(xs).to.be.deep.equal([ [ NaN, NaN ], [ NaN, NaN ], [ NaN, NaN ] ])
        expect(ys).to.be.deep.equal([ [ NaN, NaN ], [ NaN, NaN ], [ NaN, NaN ] ])
      })

      it("should not return explicit edge coords if coords don't exist", () => {
        const edge_source = new ColumnDataSource()
        edge_source.data.start = [4,4,4]
        edge_source.data.end = [5,6,7]
        edge_source.data.xs = [ [ -1, -0.5, 0 ], [ -1, 0, 1 ], [ -1, -0.5, 0 ] ]
        edge_source.data.ys = [ [ 0, 0.5, 1 ], [ 0, 0, 0 ], [ 0, -0.5, -1 ] ]

        const [xs, ys] = layout_provider.get_edge_coordinates(edge_source)
        expect(xs).to.be.deep.equal([ [ NaN, NaN ], [ NaN, NaN ], [ NaN, NaN ] ])
        expect(ys).to.be.deep.equal([ [ NaN, NaN ], [ NaN, NaN ], [ NaN, NaN ] ])
      })
    })
  })
})
