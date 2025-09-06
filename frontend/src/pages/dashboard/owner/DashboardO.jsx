import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Button,
  Tag,
  Row,
  Col,
  Card,
  Skeleton,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { MailOutlined, SearchOutlined } from "@ant-design/icons";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import { motion } from "framer-motion";
import PastWorkViewModal from "../../../modal/PastWorkViewModal";

const API = import.meta.env.VITE_API_URL;

const { Search } = Input;

const HeaderBanner = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 160,
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: 20,
        overflow: "hidden",
      }}
    >
      {/* Decorative SVGs */}
      <svg
        style={{
          position: "absolute",
          top: 10,
          right: 40,
          opacity: 0.2,
          transform: "rotate(15deg)",
        }}
        width="60"
        height="60"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#FF7A5A"
          strokeWidth="4"
          fill="none"
        />
      </svg>

      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: "30%",
          opacity: 0.15,
        }}
        width="80"
        height="80"
        viewBox="0 0 100 100"
      >
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          stroke="#FF7A5A"
          strokeWidth="4"
          fill="none"
        />
      </svg>

      <svg
        style={{
          position: "absolute",
          top: "30%",
          right: "15%",
          opacity: 0.12,
        }}
        width="70"
        height="70"
        viewBox="0 0 100 100"
      >
        <polygon
          points="50,10 90,90 10,90"
          stroke="#FF7A5A"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* House icon */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 72 72"
        style={{
          marginRight: 12,
          minWidth: 32,
          zIndex: 2,
        }}
      >
        <g stroke="#FF7A5A" strokeWidth={2} fill="none">
          <path d="M12 50 L36 28 L60 50 Z" />
          <rect x="18" y="50" width="36" height="24" />
          <path d="M36 50 L36 74" />
        </g>
      </svg>

      {/* Text */}
      <div style={{ color: "#fff", zIndex: 2 }}>
        <Typography.Title
          level={3}
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "clamp(16px, 2.5vw, 24px)",
          }}
        >
          Explore Builders & Portfolios
        </Typography.Title>
        <Typography.Text
          style={{
            color: "#ccc",
            fontSize: "clamp(12px, 2vw, 16px)",
          }}
        >
          Find trusted builders near you
        </Typography.Text>
      </div>
    </div>
  );
};

const DashboardO = () => {
    const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [pastWorkOpen, setPastWorkOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const handleOpenPastWork = (work, portfolio) => {
    setSelectedPortfolio(portfolio);
    setSelectedWork(work);
    setPastWorkOpen(true);
  };

  const handleClosePastWork = () => setPastWorkOpen(false);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/builder/all-portfolios`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPortfolios(res.data.portfolios);
        setFilteredPortfolios(res.data.portfolios);
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredPortfolios(portfolios);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = portfolios.filter((p) => {
      const company = p.company?.toLowerCase() || "";
      const username = p.createdBy?.username?.toLowerCase() || "";
      const works = p.pastWorks?.some((w) =>
        w.title?.toLowerCase().includes(lower)
      );
      return (
        company.includes(lower) || username.includes(lower) || works
      );
    });
    setFilteredPortfolios(filtered);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        marginTop: 20,
        color: "#fff",
      }}
    >
      <Sidebar role="owner" />
      <div style={{ flexGrow: 1, padding: 24 }}>
        {/* Header */}
        <HeaderBanner />

        {/* Search Bar */}
        {/* Search Bar */}
        <div style={{ marginBottom: 24, maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Search by company, builder or past work"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #444",
              backgroundColor: "#1e1e1e",
              color: "#fff",
              fontSize: 16,
            }}
          />
        </div>

        {loading ? (
          <Row gutter={[24, 24]}>
            {[...Array(6)].map((_, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Skeleton
                  active
                  paragraph={{ rows: 4 }}
                  style={{ backgroundColor: "#1f1f1f" }}
                />
              </Col>
            ))}
          </Row>
        ) : filteredPortfolios.length === 0 ? (
          <Typography.Text
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 50,
              fontSize: 18,
              color: "#aaa",
            }}
          >
            No portfolios found.
          </Typography.Text>
        ) : (
          <Row gutter={[24, 24]}>
            {filteredPortfolios.map((portfolio, idx) => (
              <Col xs={24} sm={12} md={8} key={portfolio._id}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card
                    hoverable
                    style={{
                      boxShadow: "none",
                      border: "none",
                      borderRadius: 16,
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      height: 250,
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#1e1e1e",
                      color: "#fff",
                    }}
                    bodyStyle={{
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Avatar
                        size={64}
                        src={portfolio.logo?.url}
                        style={{
                          backgroundColor: portfolio.logo
                            ? "transparent"
                            : "#393837ff",
                          marginRight: 16,
                          fontSize: 24,
                          color: "#fff",
                        }}
                      >
                        {!portfolio.logo?.url &&
                          portfolio.company?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div>
                        <Typography.Text
                          strong
                          style={{ fontSize: 16, color: "#fff" }}
                        >
                          {portfolio.company}
                        </Typography.Text>
                        <br />
                        <Typography.Text
                          type="secondary"
                          style={{ color: "#aaa" }}
                        >
                          {portfolio.createdBy?.username}
                        </Typography.Text>
                        <br />
                        <Typography.Text
                          type="secondary"
                          style={{ color: "#aaa" }}
                        >
                          {portfolio.experience} yrs experience
                        </Typography.Text>
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: 12,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        maxHeight: 60,
                        overflowY: "auto",
                      }}
                    >
                      {portfolio.pastWorks?.map((work, idx) => (
                        <Tag
                          color="default"
                          key={idx}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#333",
                            color: "#fff",
                          }}
                          onClick={() => handleOpenPastWork(work, portfolio)}
                        >
                          {work.title}
                        </Tag>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "auto",
                      }}
                    >
                      <Button
                        type="text"
                        icon={
                          <MailOutlined
                            style={{ color: "#FF7A5A", fontSize: 18 }}
                          />
                        }
                        href={`https://mail.google.com/mail/?view=cm&to=${portfolio.createdBy?.email}`}
                        target="_blank"
                        style={{
                          transition: "transform 0.2s",
                          color: "#FF7A5A",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#FF7A5A",
                          borderColor: "#FF7A5A",
                          transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#FF5733";
                          e.currentTarget.style.borderColor = "#FF5733";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#FF7A5A";
                          e.currentTarget.style.borderColor = "#FF7A5A";
                        }}
                          onClick={() => navigate(`/owner-dashboard/view/${portfolio._id}`)} 
                      >
                        View More
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

        {selectedWork && (
          <PastWorkViewModal
            open={pastWorkOpen}
            handleClose={handleClosePastWork}
            portfolio={selectedPortfolio}
            work={selectedWork}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardO;