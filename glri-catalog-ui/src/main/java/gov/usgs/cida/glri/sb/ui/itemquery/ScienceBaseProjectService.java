/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui.itemquery;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.common.io.CharStreams;

import gov.usgs.cida.glri.sb.ui.AppConfig;

/**
 *
 * @author duselman
 */
public class ScienceBaseProjectService extends HttpServlet {

	private static final Logger log = Logger.getLogger(ScienceBaseProjectService.class.getName());
	
	private static final long serialVersionUID = 1L;

	private static final String AUTH = "auth";
	
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
		
		try {
			String token = request.getParameter(AUTH);
			if (token == null || token.length()<32) {
				throw new RuntimeException("Missing Auth Key");
			}
			
			String newProjectJson = CharStreams.toString( request.getReader() );
			if (newProjectJson == null || newProjectJson.length()<32) {
				throw new RuntimeException("Missing Project Data");
			}
			log.finest("submitting new project: " + newProjectJson);

			ScienceBaseNewProject project = new ScienceBaseNewProject();
			String projectId = project.post(AppConfig.instance(), token, newProjectJson);
			if (projectId == null || projectId.length()<32) {
				throw new RuntimeException("Missing Project ID");
			}
			
			response.setContentType("text/plain; charset=UTF-8");
			PrintWriter out = response.getWriter();
			out.write(projectId);
		} catch (RuntimeException ex) {
			log.log(Level.WARNING, null, ex);
			PrintWriter out = response.getWriter();
			out.write(ex.getMessage());
		} catch (IOException ex) {
			log.log(Level.SEVERE, null, ex);
			PrintWriter out = response.getWriter();
			out.write("Error contacting ScienceBase.gov");
		} catch (Exception ex) {
			log.log(Level.SEVERE, null, ex);
			PrintWriter out = response.getWriter();
			out.write("Error");
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
