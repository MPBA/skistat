function create_tree(label, long_label, count) {

    this.width = 300;
    this.height = 500;

    this.tree = d3.layout.tree().size([this.width - 20, this.height - 20]);

    this.root = { id: 0, label: label, count: count, long_label: long_label };
    this.nodes = this.tree(this.root);
    this.root.parent = this.root;
    this.root.px = this.root.x;
    this.root.py = this.root.y;

    this.diagonal = d3.svg.diagonal();

    var svg = d3.select("#info2").append("svg:svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", "translate(10,10)");

    this.node = svg.selectAll(".node");
    this.link = svg.selectAll(".link");
    this.clicked = [0]
    this.indice_tree = 0;


    this.update = function(indice_tree, parent, label, long_label, count) {

        // Add a new node
        console.log(count, indice_tree, parent, label)
        var n = { id: indice_tree, label: label, count: count, long_label: long_label };
        p = this.nodes[parent | 0];
        if (p.children) p.children.push(n);
        else p.children = [n];
        this.nodes.push(n);
        this.indice_tree = indice_tree;

        // Recompute the layout and data join.
        this.node = this.node.data(this.tree.nodes(this.root), function(d) { return d.id; });
        this.link = this.link.data(this.tree.links(this.nodes), function(d) { return d.source.id + "-" + d.target.id; });
        percorso = function(d, fatti) {
                if (!d.parent) {
                    return (fatti.push(d.label))
                } else {
                    return (percorso(d.parent, fatti.push(d.label)))
                }
            }
            // Add entering nodes in the parent’s old position.
        this.node.enter().append("circle")
            .attr("class", "node")
            .attr("click", alert())
            .attr("r", function(d) { return Math.log(d.count + 1) || 1; })
            .attr("cx", function(d) { return d.parent.px; })
            .attr("cy", function(d) { return d.parent.py; });

        // Add entering links in the parent’s old position.
        this.link.enter().insert("path", ".node")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = { x: d.source.px, y: d.source.py };
                return d3.svg.diagonal()({ source: o, target: o });
            });

        // Transition nodes and links to their new positions.
        var t = svg.transition()
            .duration(2500);

        t.selectAll(".link")
            .attr("d", this.diagonal);

        this.node.enter().append("text")
            .attr("class", "text")
            .attr("x", function(d) { return d.parent.px; })
            .attr("y", function(d) { return d.parent.py; })
            //.attr("dx", ".35em")
            .attr("text-anchor", "right")
            .text(function(d) { return d.label; })
            //.style("fill-opacity", 1e-6);

        t.selectAll(".node")
            .attr("cx", function(d) { return d.px = d.x; })
            .attr("cy", function(d) { return d.py = d.y; });

        t.selectAll(".text")
            .attr("x", function(d) { return d.px = d.x + 10; })
            .attr("y", function(d) { return d.py = d.y + 5; });
        $('svg circle').tipsy({
            gravity: 'sw',
            html: true,
            title: function() {

                var d = this.__data__;
                console.log(d)
                return d.long_label + "<br>" + d.count + " bips";
            }
        })

        function click(d) {

            var path_generale = '-'
            aa = percorso(d.label, [])
            console.log(aa, connections)
            for (var j = 0; j < connections.length; j++) {
                if (connections[j].source == Number(d.label)) {
                    var count = matchOverlap(tmp, new RegExp((path_generale + connections[j].target + '-'), "g")).length;
                    console.log(count, aa = connections[j])
                    update(indice_tree++, d.indice_tree, connections[j].target, connections[j]['target-label'], count)


                }
            }

        }

    }

}