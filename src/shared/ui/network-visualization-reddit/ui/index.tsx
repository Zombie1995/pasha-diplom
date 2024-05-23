import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

export interface CommentReddit {
  id: string;
  body: string;
  parent_id: string | null;
}

interface NetworkVisualizationRedditProps {
  comments: CommentReddit[];
  width?: number;
  height?: number;
}

interface NodeData {
  id: string;
  parent_id: string | null;
  body: string;
  x: number;
  y: number;
  fx?: number;
  fy?: number;
}

interface LinkData {
  source: NodeData;
  target: NodeData;
  value: number;
}

const NetworkVisualizationReddit: React.FC<NetworkVisualizationRedditProps> = ({
  comments,
  width = 800,
  height = 600,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize the D3.js network visualization
    const container = d3.select(containerRef.current);

    // Extract nodes and links from the comments data
    const nodes: NodeData[] = comments.map((comment) => ({
      id: comment.id,
      parent_id: comment.parent_id,
      body: comment.body,
      x: 0,
      y: 0,
      fx: undefined,
      fy: undefined,
    }));

    const links: LinkData[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[i].parent_id === nodes[j].id) {
          links.push({
            source: nodes[j],
            target: nodes[i],
            value: 1,
          });
        }
      }
    }

    const nodeRadius = 10;

    const simulation = d3
      .forceSimulation<NodeData>(nodes)
      .force(
        "link",
        d3.forceLink<NodeData, LinkData>(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll<SVGLineElement, LinkData>("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, NodeData>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d) => (d.parent_id ? "#9b59b6" : "#2980b9"))
      .on("click", (event, d) => handleNodeClick(event, d))
      .call(
        d3
          .drag<SVGCircleElement, NodeData>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    function handleNodeClick(
      event: React.MouseEvent<SVGCircleElement, MouseEvent>,
      node: NodeData
    ) {
      setSelectedNode(node);
      setModalPosition({ x: event.clientX, y: event.clientY });
      setShowModal(true);
    }

    function dragstarted(
      event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>
    ) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>
    ) {
      if (!event.active) simulation.alphaTarget(0);
      if (event.subject.fx !== undefined && event.subject.fy !== undefined) {
        event.subject.fx = undefined;
        event.subject.fy = undefined;
      }
    }

    // Add event listener to close the modal on Escape button press
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      svg.remove();
    };
  }, [comments, height, width]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Node Information"
        className="bg-none"
        overlayClassName="fixed top-0 left-0 w-screen h-screen overflow-y-scroll bg-gray-500 bg-opacity-50"
      >
        {selectedNode && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bg-white shadow-lg rounded-lg rounded-tl-none p-6 max-w-md"
            style={{
              left: modalPosition.x + "px",
              top: modalPosition.y + "px",
            }}
          >
            <h3 className="text-lg font-bold mb-2">Node Information</h3>
            <p>ID: {selectedNode.id}</p>
            <p>Body: {selectedNode.body}</p>
            <p>Parent ID: {selectedNode.parent_id || "None"}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NetworkVisualizationReddit;
