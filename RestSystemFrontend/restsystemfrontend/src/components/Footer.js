import React from "react";
import './FooterStyles.css'
  
const Footer = () => {
  return (
    <footer class="site-footer">
        <div class="container">
            <div class="row">
            <div class="col-sm-12 col-md-6">
                <h6>About</h6>
                <p class="text-justify">A footer to show the users that hey have reached the end of the page, providing important information that the user may want to see</p>
            </div>

            <div class="col-xs-6 col-md-3">
                <h6>Quick Links</h6>
                <ul class="footer-links">
                <li><a href="http://scanfcode.com/about/">About Us</a></li>
                <li><a href="http://scanfcode.com/contact/">Contact Us</a></li>
                <li><a href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a></li>
                <li><a href="http://scanfcode.com/privacy-policy/">Privacy Policy</a></li>
                <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
                </ul>
            </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
            <div class="col-md-8 col-sm-6 col-xs-12">
                <p class="copyright-text">Copyright &copy; 2017 All Rights Reserved by 
            <a href="#">Scanfcode</a>.
                </p>
            </div>
            </div>
        </div>
    </footer>
  );
};
export default Footer;