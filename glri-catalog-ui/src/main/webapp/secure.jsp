<%
	String path = request.getRequestURI().replace("secure.jsp", "");
	response.sendRedirect(path);
%>
