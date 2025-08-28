import React, { useEffect, useState } from "react";
import { Typography, Avatar, Button, Tag, Row, Col, Card, Skeleton } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import { motion } from "framer-motion";
import ViewBuilderModal from "../../../modal/ViewBuilderModal";
import PastWorkViewModal from "../../../modal/PastWorkViewModal";

const API = import.meta.env.VITE_API_URL;

const DashboardO = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState(null);
  const [pastWorkOpen, setPastWorkOpen] = useState(false);

  const handleOpenPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setOpen(true);
  };
  const handleClosePortfolio = () => setOpen(false);

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
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", marginTop: 70, color: "#fff" }}>
      <Sidebar role="owner" />
      <div style={{ flexGrow: 1, padding: 24 }}>
        {loading ? (
          <Row gutter={[24, 24]}>
            {[...Array(6)].map((_, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Skeleton active paragraph={{ rows: 4 }} style={{ backgroundColor: "#1f1f1f" }} />
              </Col>
            ))}
          </Row>
        ) : portfolios.length === 0 ? (
          <Typography.Text
            style={{ display: "block", textAlign: "center", marginTop: 50, fontSize: 18, color: "#aaa" }}
          >
            No portfolios found.
          </Typography.Text>
        ) : (
          <Row gutter={[24, 24]}>
            {portfolios.map((portfolio, idx) => (
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
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#1e1e1e",
                      color: "#fff",
                    }}
                    bodyStyle={{ padding: 16, display: "flex", flexDirection: "column", flexGrow: 1 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                      <Avatar
                        size={64}
                        src={portfolio.logo?.url}
                        style={{
                          backgroundColor: portfolio.logo ? "transparent" : "#FF7A5A",
                          marginRight: 16,
                          fontSize: 24,
                          color: "#fff",
                        }}
                      >
                        {!portfolio.logo?.url && portfolio.company?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div>
                        <Typography.Text strong style={{ fontSize: 16, color: "#fff" }}>
                          {portfolio.company}
                        </Typography.Text>
                        <br />
                        <Typography.Text type="secondary" style={{ color: "#aaa" }}>
                          {portfolio.createdBy?.username}
                        </Typography.Text>
                        <br />
                        <Typography.Text type="secondary" style={{ color: "#aaa" }}>
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
                          style={{ cursor: "pointer", backgroundColor: "#333", color: "#fff" }}
                          onClick={() => handleOpenPastWork(work, portfolio)} 
                        >
                          {work.title}
                        </Tag>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
                      <Button
                        type="text"
                        icon={<MailOutlined style={{ color: "#FF7A5A", fontSize: 18 }} />}
                        href={`https://mail.google.com/mail/?view=cm&to=${portfolio.createdBy?.email}`}
                        target="_blank"
                        style={{ transition: "transform 0.2s", color: "#FF7A5A" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                        onClick={() => handleOpenPortfolio(portfolio)}
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

        {selectedPortfolio && (
          <ViewBuilderModal
            open={open}
            handleClose={handleClosePortfolio}
            portfolio={selectedPortfolio}
            onPastWorkClick={handleOpenPastWork}
          />
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
