import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Button, Space } from "antd";
import ResizeObserver from "rc-resize-observer"; // Ant Design ResizeObserver
import "./index.scss";

const TeamMembersList = ({ members = [], showMore = true }) => {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(members.length);
  const [containerWidth, setContainerWidth] = useState(0);

  // Function to update visible members based on space
  const updateVisibleCount = () => {
    if (!containerRef.current || !showMore) return; // Skip resizing if showMore is false

    const newWidth = containerRef.current.offsetWidth;
    setContainerWidth(newWidth); // Store width for updates

    const memberTags = containerRef.current.querySelectorAll(".member-tag");
    let availableWidth = newWidth - 60; // Space for "+ More" button
    let count = 0;

    for (let tag of memberTags) {
      const tagWidth = tag.offsetWidth;
      if (availableWidth >= tagWidth) {
        availableWidth -= tagWidth + 8; // Include margin
        count++;
      } else {
        break;
      }
    }

    setVisibleCount(Math.max(count, 1)); // Always show at least one
  };

  useEffect(() => {
    if (showMore) {
      updateVisibleCount(); // Run on mount only if showMore is enabled
    }
  }, [members, showMore]);

  return (
    <ResizeObserver
      onResize={() => {
        if (showMore) updateVisibleCount();
      }}
    >
      <div className="team-members-container" ref={containerRef}>
        <Space wrap className="team-members-list">
          {members
            .slice(0, showMore ? visibleCount : members.length)
            .map((member, index) => (
              <span key={index} className="member-tag">
                {member}
              </span>
            ))}

          {showMore && members.length > visibleCount && (
            <Dropdown
              menu={{
                items: members.slice(visibleCount).map((member, index) => ({
                  key: index,
                  label: <span className="member-dropdown-item">{member}</span>,
                })),
              }}
              trigger={["click"]}
            >
              <Button type="link" className="more-members">
                +{members.length - visibleCount} More
              </Button>
            </Dropdown>
          )}
        </Space>
      </div>
    </ResizeObserver>
  );
};

export default TeamMembersList;