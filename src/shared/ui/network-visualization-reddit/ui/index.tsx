import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { getColorFromNumber } from "../model";

export interface CommentReddit {
  id: string;
  body: string;
  parent_id: string | null;
  class?: string;
}

interface NetworkVisualizationRedditProps {
  comments: CommentReddit[];
}

interface NodeData {
  id: string;
  group: number;
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
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const networkWidth = 4000;
  const networkHeight = 4000;

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentScrollPosition, setCurrentScrollPosition] = useState({
    scrollLeft: 0,
    scrollTop: 0,
  });

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setCurrentScrollPosition({
      scrollLeft: scrollRef.current!.scrollLeft,
      scrollTop: scrollRef.current!.scrollTop,
    });
  };

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      scrollRef.current!.scrollLeft =
        currentScrollPosition.scrollLeft - (e.clientX - startPosition.x);
      scrollRef.current!.scrollTop =
        currentScrollPosition.scrollTop - (e.clientY - startPosition.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    const container = containerRef.current;
    if (container) {
      const currentScale = parseFloat(
        container.style.transform.split("(")[1] || "1"
      );
      container.style.transform = `scale(${currentScale * 1.1})`;
    }
  };

  const zoomOut = () => {
    const container = containerRef.current;
    if (container) {
      const currentScale = parseFloat(
        container.style.transform.split("(")[1] || "1"
      );
      container.style.transform = `scale(${currentScale / 1.1})`;
    }
  };

  useEffect(() => {
    const { height, width } = scrollRef.current!.getBoundingClientRect();
    setTimeout(() => {
      scrollRef.current!.scrollTop = networkHeight / 2 - height / 2;
      scrollRef.current!.scrollLeft = networkWidth / 2 - width / 2;
    }, 0);
  }, []);

  useEffect(() => {
    // Initialize the D3.js network visualization
    const container = d3.select(containerRef.current);

    // Extract nodes and links from the comments data
    const uniqueClasses = new Set(comments.map((comment) => comment.class));
    const nodes: NodeData[] = comments.map((comment) => ({
      id: comment.id,
      group: comment.class
        ? Array.from(uniqueClasses).indexOf(comment.class)
        : -1,
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
      .force("center", d3.forceCenter(networkWidth / 2, networkHeight / 2))
      .force("x", d3.forceX(networkWidth / 2).strength(0.1))
      .force("y", d3.forceY(networkHeight / 2).strength(0.1));

    const svg = container
      .append("svg")
      .attr("width", networkWidth)
      .attr("height", networkHeight);

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
      .attr("fill", (d) => getColorFromNumber(d.group))
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
  }, [comments, networkHeight, networkWidth]);

  return (
    <div className="w-full h-full relative">
      <div className="z-[100] absolute top-2 right-5 flex flex-col gap-2">
        <button onClick={zoomIn}>
          <svg
            className="size-[28px]"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 297 297"
            xmlSpace="preserve"
          >
            <g>
              <path d="M150.079,100.075c-0.002,0-0.004,0-0.006,0l-30.039,0.018l0.014-30.045c0.003-5.499-4.454-9.961-9.953-9.963 c-0.002,0-0.003,0-0.005,0c-5.498,0-9.954,4.454-9.957,9.953l-0.015,30.065l-30.067,0.018c-5.499,0.003-9.956,4.463-9.953,9.963 c0.003,5.5,4.461,9.953,9.959,9.953c0.002,0,0.004,0,0.006,0l30.046-0.018l-0.015,30.05c-0.003,5.499,4.454,9.959,9.953,9.962 c0.002,0,0.003,0,0.005,0c5.498,0,9.955-4.454,9.958-9.952l0.015-30.07l30.061-0.018c5.499-0.003,9.954-4.464,9.951-9.964 C160.034,104.529,155.576,100.075,150.079,100.075z" />
              <path d="M288.969,246.75l-82.916-83.005c23.368-41.89,17.289-95.942-18.242-131.508C167.048,11.449,139.438,0,110.069,0 C80.701,0,53.091,11.449,32.323,32.237c-42.863,42.911-42.863,112.729,0,155.631c20.767,20.793,48.378,32.243,77.746,32.243 c19.095,0,37.441-4.845,53.65-13.944l82.879,82.971c5.064,5.071,11.814,7.862,19.009,7.862c7.193,0,13.945-2.791,19.01-7.862 l4.354-4.36C299.443,274.293,299.442,257.232,288.969,246.75z M46.412,173.794c-35.108-35.143-35.107-92.332,0-127.483 c17.006-17.02,39.612-26.395,63.657-26.395c24.045,0,46.65,9.375,63.653,26.395c35.112,35.149,35.112,92.338-0.002,127.484 c-17.001,17.024-39.606,26.4-63.651,26.4C86.024,200.195,63.418,190.819,46.412,173.794z M274.879,270.704l-4.355,4.36 c-1.299,1.302-3.046,2.02-4.917,2.02c-1.87,0-3.616-0.719-4.918-2.02l-80.311-80.4c2.562-2.142,5.046-4.403,7.432-6.794 c2.393-2.394,4.643-4.878,6.768-7.429l80.301,80.384C277.553,263.502,277.553,268.025,274.879,270.704z" />
            </g>
          </svg>
        </button>
        <button onClick={zoomOut}>
          <svg
            className="size-[28px]"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 297 297"
            xmlSpace="preserve"
          >
            <g>
              <path d="M150.08,100.079c-0.002,0-0.003,0-0.005,0l-80.031,0.041c-5.501,0.002-9.958,4.463-9.955,9.963 c0.003,5.499,4.461,9.955,9.959,9.955c0.002,0,0.004,0,0.006,0l80.031-0.04c5.5-0.003,9.957-4.464,9.954-9.964 C160.036,104.535,155.578,100.079,150.08,100.079z" />
              <path d="M288.985,246.75l-82.926-83.005c23.369-41.891,17.288-95.941-18.245-131.508C167.048,11.449,139.436,0,110.064,0 C80.691,0,53.076,11.449,32.306,32.237c-42.864,42.914-42.863,112.73,0,155.634c20.77,20.793,48.386,32.243,77.758,32.243 c19.097,0,37.446-4.845,53.657-13.944l82.89,82.969c5.063,5.069,11.815,7.861,19.011,7.861c7.196,0,13.948-2.792,19.013-7.861 l4.352-4.355C299.461,274.298,299.461,257.236,288.985,246.75z M46.398,173.794c-35.109-35.143-35.109-92.329,0-127.479 c17.006-17.021,39.617-26.397,63.666-26.397c24.049,0,46.656,9.376,63.659,26.396c35.116,35.149,35.116,92.336,0,127.48 c-17.004,17.024-39.61,26.4-63.659,26.4C86.015,200.195,63.404,190.819,46.398,173.794z M274.894,270.704l-4.353,4.356 c-1.301,1.303-3.048,2.021-4.92,2.021c-1.871,0-3.617-0.718-4.919-2.02l-80.32-80.395c2.562-2.141,5.045-4.403,7.432-6.794 c2.393-2.394,4.645-4.877,6.771-7.431l80.31,80.386C277.567,263.506,277.568,268.027,274.894,270.704z" />
            </g>
          </svg>
        </button>
      </div>
      <div
        ref={scrollRef}
        className="w-full h-full overflow-scroll"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div ref={containerRef}>
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
      </div>
    </div>
  );
};

export default NetworkVisualizationReddit;
