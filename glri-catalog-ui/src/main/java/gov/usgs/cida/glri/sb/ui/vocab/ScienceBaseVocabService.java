/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui.vocab;

import gov.usgs.cida.glri.sb.ui.itemquery.*;
import com.google.common.io.CharStreams;
import gov.usgs.cida.glri.sb.ui.AppConfig;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author eeverman
 */
public class ScienceBaseVocabService extends HttpServlet {

	/**
	 * Processes requests for both HTTP
	 * <code>GET</code> and
	 * <code>POST</code> methods.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		
		
		
		PrintWriter out = response.getWriter();
		

		ScienceBaseVocabQuery query = new ScienceBaseVocabQuery();
		Map<String, String[]> reqMap = request.getParameterMap();
		
		
		try {
			
			String strResponse = query.getQueryResponse(reqMap);
			response.setContentType(query.getRequestedFormat().getFullName() + "; charset=UTF-8");
			out.write(strResponse);
		
		} catch (Exception ex) {
			Logger.getLogger(ScienceBaseVocabService.class.getName()).log(Level.SEVERE, null, ex);
			
			response.setContentType("text/html;charset=UTF-8");
			out.println("<!DOCTYPE html>");
			out.println("<html>");
			out.println("<head>");
			out.println("<title>Servlet ScienceBaseVocabQuery</title>");			
			out.println("</head>");
			out.println("<body>");
			out.println("<h1>Servlet ScienceBaseVocabQuery at " + request.getContextPath() + "</h1>");
			out.println("<p>Error</p>");
			out.println("</body>");
			out.println("</html>");
		} finally {			
			out.close();
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
		processRequest(request, response);
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
		return "Short description";
	}// </editor-fold>

}
