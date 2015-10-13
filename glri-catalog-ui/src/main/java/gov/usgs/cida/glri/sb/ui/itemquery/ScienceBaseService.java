/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui.itemquery;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Map;
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
 * @author eeverman
 */
public class ScienceBaseService extends HttpServlet {

	private static final long serialVersionUID = 1L;

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
		
		String devMode = AppConfig.get(AppConfig.SCIENCEBASE_GLRI_LOCAL_DEV_MODE);
		if ( "true".equalsIgnoreCase(devMode) ) {
			//just return our static json file - we are running in dev mode and
			//probably can't reach the sb server anyways.

			InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("/gov/usgs/cida/glri/sb/ui/itemquery/canned_data.json");
			String stringFromStream = CharStreams.toString(new InputStreamReader(inputStream, "UTF-8"));
			response.setContentType("application/json; charset=UTF-8");
			out.write(stringFromStream);
			return;
		}

		ScienceBaseQuery query = new ScienceBaseQuery();
		Map<String, String[]> reqMap = request.getParameterMap();
		
		
		try {
			
			String strResponse = query.getQueryResponse(reqMap);
			response.setContentType(query.getRequestedFormat().getFullName() + "; charset=UTF-8");
			out.write(strResponse);
		
		} catch (Exception ex) {
			Logger.getLogger(ScienceBaseService.class.getName()).log(Level.SEVERE, null, ex);
			
			response.setContentType("text/html;charset=UTF-8");
			out.println("<!DOCTYPE html>");
			out.println("<html>");
			out.println("<head>");
			out.println("<title>Servlet ScienceBaseQuery</title>");			
			out.println("</head>");
			out.println("<body>");
			out.println("<h1>Servlet ScienceBaseQuery at " + request.getContextPath() + "</h1>");
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
