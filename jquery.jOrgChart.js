/**
 * jQuery org-chart/tree plugin.
 *
 * Author: Wes Nolte
 * http://twitter.com/wesnolte
 *
 * Based on the work of Mark Lee
 * http://www.capricasoftware.co.uk 
 *
 * Copyright (c) 2011 Wesley Nolte
 * Dual licensed under the MIT and GPL licenses.
 *
 */
(function($) {

    $.fn.jOrgChart = function(options) {
        var opts = $.extend({}, $.fn.jOrgChart.defaults, options);
        var $appendTo = opts.chartElement;

        // build the tree
        $this = $(this);
        var $container = $("<div class='" + opts.chartClass + "'/>");
        if ($this.is("ul")) {
            buildNode($this.find("li:first"), $container, 0, opts);
        }
        else if ($this.is("li")) {
            buildNode($this, $container, 0, opts);
        }
        $appendTo.append($container);

        // add drag and drop if enabled
        if (opts.dragAndDrop) {
            $('div.node').draggable({
                cursor: 'move',
                distance: 40,
                helper: 'clone',
                opacity: 0.8,
                revert: 'invalid',
                revertDuration: 100,
                snap: 'div.node.expanded',
                snapMode: 'inner',
                stack: 'div.node'
            });

            $('div.node').droppable({
                accept: '.node',
                activeClass: 'drag-active',
                hoverClass: 'drop-hover'
            });

            // Drag start event handler for nodes
            $('div.node').bind("dragstart", function handleDragStart(event, ui) {

                var sourceNode = $(this);
                sourceNode.parentsUntil('.node-container')
                   .find('*')
                   .filter('.node')
                   .droppable('disable');
            });

            // Drag stop event handler for nodes
            $('div.node').bind("dragstop", function handleDragStop(event, ui) {

                /* reload the plugin */
                opts.chartElement.children().remove();
                $this.jOrgChart(opts);
            });

            // Drop event handler for nodes
            $('div.node').bind("drop", function handleDropEvent(event, ui) {

                var targetID = $(this).data("tree-node");
                var targetLi = $this.find("li").filter(function() { return $(this).data("tree-node") === targetID; });
                var targetUl = targetLi.children('ul');

                var sourceID = ui.draggable.data("tree-node");
                var sourceLi = $this.find("li").filter(function() { return $(this).data("tree-node") === sourceID; });
                var sourceUl = sourceLi.parent('ul');

                if (targetUl.length > 0) {
                    targetUl.append(sourceLi);
                } else {
                    targetLi.append("<ul></ul>");
                    targetLi.children('ul').append(sourceLi);
                }

                //Removes any empty lists
                if (sourceUl.children().length === 0) {
                    sourceUl.remove();
                }

            }); // handleDropEvent

        } // Drag and drop
    };

    // Option defaults
    $.fn.jOrgChart.defaults = {
        chartElement: $('body'),
        depth: -1,
        chartClass: "jOrgChart",
        dragAndDrop: false
    };

    var nodeCount = 0;

    //判断是否变红
    function isHalfRed(arrayRed, count, judgement) {
        var nodeCount = arrayRed.length;
        var odevity = arrayRed.length % 2 == 1 ? true : false; //判断true为奇数个子节点,反正之则为false

        var minx = -1; //数组在前一半最小的下标为true,默认为-1
        var maxx = -1; //数组在后一半最大的下标为true,默认为-1
        var isFirst = -1;
        for (var i = 0; i < arrayRed.length; i++) {
            if (arrayRed[i] == true) {

                if (i <= half - 1) {
                    if (isFirst != 1) {
                        minx = i;
                    }
                    isFirst = 1;

                }
                else if (i >= half - 1) {
                    max = i;
                }


            }
        }

        //-----------奇数个
        if (odevity == true) {
            var half = (nodeCount - 1) / 2 + 1;
            var before = false; //brfore index, judge whether red line is

            if (count < half) {
                //when red,return number
                for (var i = 0; i < count - 1; i++) {
                    beforered = beforered || arrayRed[i];
                }

            }
            else if (count > half) {
                //when red,return number
                for (var i = nodeCount; i > count - 1; i--) {
                    beforered = beforered || arrayRed[i];
                }
            }

            //返回合适的图形标码
            if (count < half) {
                if (judgement == true) {
                    if (beforered == true) { //red left right top
                        return 1;
                    }
                    else {
                        return 21; //red left top 
                    }
                }
                else {
                    if (beforered == true) {//red  top
                        return 2;
                    }
                    else {
                        return 9; //black left right top
                    }
                }
            }
            else if (count > half) {
                if (judgement == true) {
                    if (beforered == true) { //red left right top
                        return 4;
                    }
                    else {
                        return 22; //red top 
                    }
                }
                else {
                    if (beforered == true) {//red left top
                        return 2;
                    }
                    else {
                        return 9; //black left right top
                    }
                }
            }
            else if (count == half) {
                if (judgement == true) {
                    var ba = false;
                    var bc = false;
                    for (var i = 0; i < half - 1; i++) {
                        ba = ba || arrayRed[i];

                    }

                    //when red,return number
                    for (var i = nodeCount - 1; i > half - 1; i--) {
                        bc = bc || arrayRed[i];

                    }
                    if (ba == false) {
                        if (bc == false) {
                            return 13; //中间红
                        }
                        else {
                            return 14; //中间红加右边红
                        }
                    }
                    else if (ba == true) {
                        if (bc == false) {
                            return 15; //中间红加左边红
                        }
                        else {
                            return 4; //全红
                        }
                    }
                    return 3; //red left right
                }
                else {

                    //when red,return number
                    var ba = false;
                    var bc = false;
                    for (var i = 0; i < half - 1; i++) {
                        ba = ba || arrayRed[i];
                    }

                    //when red,return number
                    for (var i = nodeCount - 1; i > half - 1; i--) {
                        bc = bc || arrayRed[i];
                    }
                    if (ba == false) {

                        if (bc == false) {
                            return 9;
                        }
                        else if (bc == true) {
                            return 11;
                        }
                    }
                    else if (ba == true) {//red lefttop

                        if (bc == false) {
                            return 10;
                        }
                        else if (bc == true) {
                            return 12;
                        }

                    }

                }
            }


        }

        //------------偶数个
        if (odevity == false) {
            var half = nodeCount / 2;
            var beforered = false; //brfore index, judge whether red line is
            if (count <= half) {
                //when red,return number
                for (var i = 0; i < count - 1; i++) {
                    beforered = beforered || arrayRed[i];
                }

            }
            else if (count >= half+1) {
                //when red,return number
                for (var i = nodeCount-1; i > count-1; i--) {
                    beforered = beforered || arrayRed[i];
                }
            }



            if (count <= half) {
                //console.log(arrayRed);
                //console.log(count + ":" + beforered);
                if (judgement == true) {
                    if (beforered == true) { //red left right top
                        return 1;
                    }
                    else {
                        return 14; //red top 
                    }
                }
                else {
                    if (beforered == true) {//red  top
                        return 2;
                    }
                    else {
                        return 9; //black left right top
                    }
                }
            }
            else if (count >= half + 1) {
                if (judgement == true) {
                    if (beforered == true) { //red left right top
                        return 4;
                    }
                    else {
                        return 15; //red top 
                    }
                }
                else {
                    if (beforered == true) {//red left top
                        return 2;
                    }
                    else {
                        return 9; //black left right top
                    }
                }
            }


        }
    }
    // Method that recursively builds the tree
    function buildNode($node, $appendTo, level, opts) {
        var $table = $("<table cellpadding='0' cellspacing='0' border='0' align='center' style='margin:auto;'/>");
        var $tbody = $("<tbody/>");

        // Construct the node container(s)
        var $nodeRow = $("<tr/>").addClass("node-cells");
        var $nodeCell = $("<td/>").addClass("node-cell").attr("colspan", 2);

        var $childNodes = $node.children("ul:first").children("li");
        var $nodeDiv;

        if ($childNodes.length > 1) {
            $nodeCell.attr("colspan", $childNodes.length * 2);
        }
        // Draw the node
        // Get the contents - any markup except li and ul allowed
        var $nodeContent = $node.clone()
                            .children("ul,li")
                            .remove()
                            .end()
                            .html();

        //Increaments the node count which is used to link the source list and the org chart
        nodeCount++;
        $node.data("tree-node", nodeCount);
        $nodeDiv = $("<div>").addClass("node")
                                     .data("tree-node", nodeCount)
                                     .append($nodeContent);

        // Expand and contract nodes
        //    if ($childNodes.length > 0) {
        //      $nodeDiv.click(function() {
        //          var $this = $(this);
        //          var $tr = $this.closest("tr");

        //          if($tr.hasClass('contracted')){
        //            $this.css('cursor','n-resize');
        //            $tr.removeClass('contracted').addClass('expanded');
        //            $tr.nextAll("tr").css('visibility', '');

        //            // Update the <li> appropriately so that if the tree redraws collapsed/non-collapsed nodes
        //            // maintain their appearance
        //            $node.removeClass('collapsed');
        //          }else{
        //            $this.css('cursor','s-resize');
        //            $tr.removeClass('expanded').addClass('contracted');
        //            $tr.nextAll("tr").css('visibility', 'hidden');

        //            $node.addClass('collapsed');
        //          }
        //        });
        //    }

        $nodeCell.append($nodeDiv);
        $nodeRow.append($nodeCell);
        $tbody.append($nodeRow);
        if ($childNodes.length > 0) {
            // if it can be expanded then change the cursor
            $nodeDiv.css('cursor', 'n-resize');

            // recurse until leaves found (-1) or to the level specified
            if (opts.depth == -1 || (level + 1 < opts.depth)) {

                // Draw the horizontal lines
                var redCount = 0; //是否红色线路
                var redJ = $childNodes.length; //有多少节点
                var currentJ = 0; //当前节点是第几个
                var currentG = 0;
                var arrayRed = []; //存储那些节点有isRed等于true
                var $linesRow = $("<tr/>");
                $childNodes.each(function() {
                    try {

                        if ($(this).find("a").attr("isRed") == 'true') {

                            arrayRed[currentG] = true;

                        }
                        else {

                            arrayRed[currentG] = false;

                        }
                    }
                    catch (err) {
                        arrayRed[currentG] = false;

                    }

                    ;
                    currentG++;

                });

                $childNodes.each(function() {
                    //如果未读到isRed的自定义属性跑出异常
                    currentJ++;
                    try {

                        if ($(this).find("a").attr("isRed") == 'true') {
                            redCount++;
                            //读到isRed为true，线路变红
                            //判断前面是否有红线
                            var countss = isHalfRed(arrayRed, currentJ, true);
                            if (countss == 1) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed topRed ");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed topRed");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 4) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed topRed ");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed topRed");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 3) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed top");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed top");
                                $linesRow.append($left).append($right);
                            }
                            else if (countss == 13) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed top ");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed top");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 14) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed top");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed topRed");
                                $linesRow.append($left).append($right);
                            }
                            else if (countss == 15) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed topRed ");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed top");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 21) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed top ");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed topRed");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 22) {
                                var $left = $("<td>&nbsp;</td>").addClass("line leftRed topRed ");
                                var $right = $("<td>&nbsp;</td>").addClass("line rightRed top");
                                $linesRow.append($left).append($right);

                            }
                        }
                        else {
                            var countss = isHalfRed(arrayRed, currentJ, false);
                            if (countss == 9) {
                                var $left = $("<td>&nbsp;</td>").addClass("line left top  ");
                                var $right = $("<td>&nbsp;</td>").addClass("line right top");
                                $linesRow.append($left).append($right);
                            }
                            else if (countss == 2) {
                                var $left = $("<td>&nbsp;</td>").addClass("line left topRed  ");
                                var $right = $("<td>&nbsp;</td>").addClass("line right topRed");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 10) {
                                var $left = $("<td>&nbsp;</td>").addClass("line left topRed  ");
                                var $right = $("<td>&nbsp;</td>").addClass("line right top");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 11) {
                                var $left = $("<td>&nbsp;</td>").addClass("line left top  ");
                                var $right = $("<td>&nbsp;</td>").addClass("line right topRed");
                                $linesRow.append($left).append($right);

                            }
                            else if (countss == 12) {
                                var $left = $("<td>&nbsp;</td>").addClass("line left topRed  ");
                                var $right = $("<td>&nbsp;</td>").addClass("line right topRed");
                                $linesRow.append($left).append($right);

                            }
                        }
                    }
                    catch (err) {
                        var $left = $("<td>&nbsp;</td>").addClass("line left top ");
                        var $right = $("<td>&nbsp;</td>").addClass("line right top");
                        $linesRow.append($left).append($right);
                    }


                });

                //      
                var $downLineRow = $("<tr/>");
                var $downLineCell = $("<td/>").attr("colspan", $childNodes.length * 2);
                $downLineRow.append($downLineCell);

                // draw the connecting line from the parent node to the horizontal line
                if (redCount >= 1) {
                    $downLine = $("<div></div>").addClass("line downRed");
                }
                else {
                    $downLine = $("<div></div>").addClass("line down");
                }

                $downLineCell.append($downLine);
                $tbody.append($downLineRow);




                // horizontal line shouldn't extend beyond the first and last child branches
                $linesRow.find("td:first")
                    .removeClass("top")
                 .end()
                 .find("td:last")
                    .removeClass("top");
                //移除红色的线
                $linesRow.find("td:first")
                    .removeClass("topRed")
                 .end()
                 .find("td:last")
                    .removeClass("topRed");
                $tbody.append($linesRow);
                var $childNodesRow = $("<tr/>");
                $childNodes.each(function() {
                    var $td = $("<td class='node-container'/>");
                    $td.attr("colspan", 2);
                    // recurse through children lists and items
                    buildNode($(this), $td, level + 1, opts);
                    $childNodesRow.append($td);
                });

            }
            $tbody.append($childNodesRow);
        }

        // any classes on the LI element get copied to the relevant node in the tree
        // apart from the special 'collapsed' class, which collapses the sub-tree at this point
        if ($node.attr('class') != undefined) {
            var classList = $node.attr('class').split(/\s+/);
            $.each(classList, function(index, item) {
                if (item == 'collapsed') {

                    $nodeRow.nextAll('tr').css('visibility', 'hidden');
                    $nodeRow.removeClass('expanded');
                    $nodeRow.addClass('contracted');
                    $nodeDiv.css('cursor', 's-resize');
                } else {
                    $nodeDiv.addClass(item);
                }
            });
        }

        $table.append($tbody);
        $appendTo.append($table);

        /* Prevent trees collapsing if a link inside a node is clicked */
        $nodeDiv.children('a').click(function(e) {
            e.stopPropagation();
        });
    };

})(jQuery);
