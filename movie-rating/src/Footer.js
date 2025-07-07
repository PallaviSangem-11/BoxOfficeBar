import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-5">
            <Container>
                

                {/* Newsletter */}
                <Row className="mt-3">
                    <Col md={{ span: 6, offset: 3 }}>
                        <InputGroup>
                            <Form.Control type="email" placeholder="Your email" />
                            <Button variant="primary">Subscribe</Button>
                        </InputGroup>
                    </Col>
                </Row>

                <p className="text-center mt-3">&copy; 2025 BoxOfficeBar. All Rights Reserved.</p>
            </Container>
        </footer>
    );
};

export default Footer;
