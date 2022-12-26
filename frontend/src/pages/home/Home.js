import "./home.css";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useSelector } from "react-redux";
function Home() {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <div className="homeScreen">
        <Feed home={true}></Feed>
        <Rightbar user={user} home={true}></Rightbar>
      </div>
    </>
  );
}

export default Home;
