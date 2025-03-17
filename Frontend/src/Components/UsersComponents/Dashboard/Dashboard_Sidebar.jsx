import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Dashboard.css'
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X2GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsFillCursorFill,
} from "react-icons/bs";

function Sidebar() {
  return (
    <aside id="sidebar">
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> shop
        </div>
        <span className="icon close-icon">x</span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="">
            <BsFillArchiveFill className="icon" /> sample
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/MapView">
            <BsFillCursorFill className="icon" />  sample
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/inventory">
            <BsFillGrid3X2GapFill className="icon" /> sample
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/supply-management">
            <BsPeopleFill className="icon" />  sample
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/rentalService">
            <BsFillGrid3X2GapFill className="icon" /> sample
          </a>
        </li>
      </ul>
    </aside>
  );
}
export default Sidebar;
