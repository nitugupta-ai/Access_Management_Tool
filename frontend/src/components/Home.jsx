import { Link } from "react-router-dom";
import "./Home.css"
const Home = () => {
    return (
        <div className="container">
            <h1>Access Management Tool</h1>
            <div className="button-group">
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="btn">Signup</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
