/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui.sbapi;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author duselman
 */
public class ScienceBaseAuthService extends HttpServlet {

	private static final Logger log = Logger.getLogger(ScienceBaseAuthService.class.getName());
	
	private static final long serialVersionUID = 1L;

	private static final String USERNAME = "username";
	private static final String PASSWORD = "password";
	
	/**
	 * Processes authentication requests for HTTP
	 * <code>POST</code> methods.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		String username = request.getParameter(USERNAME);
		
		try ( ScienceBaseRestClient auth = new ScienceBaseRestClient() ) {
			log.info("authenticating user: " + username);
			String authJSON = auth.login(username, request.getParameter(PASSWORD));
			if (authJSON == null || authJSON.length() != 32) {
				throw new RuntimeException("Auth Failed");
			}
			
//			response.setContentType("application/json; charset=UTF-8"); // TODO could return a JSON jossoId pair
			response.setContentType("text/plain; charset=UTF-8");
			PrintWriter out = response.getWriter();
			out.write(authJSON);
		} catch (Exception ex) {
			log.log(Level.SEVERE, "auth error " + username, ex);
			response.sendError(403);
		}
	}

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	/**
	 * Handles the HTTP
	 * <code>GET</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// allow post only
	}

	/**
	 * Handles the HTTP
	 * <code>POST</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	/**
	 * Returns a short description of the servlet.
	 *
	 * @return a String containing servlet description
	 */
	@Override
	public String getServletInfo() {
		return "ScienceBase.gov JOSSO Auth Service";
	}

}
