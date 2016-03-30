package gov.usgs.owi.javasinglesignon;

import java.security.Principal;

/**
 * A principal implementation that gives access to a JSSON Token.
 * 
 * @author eeverman
 */
public class RemoteSingleSignonPrincipal implements Principal {
	String name;
	String jssonToken;
	
	public RemoteSingleSignonPrincipal(String name, String jssonToken) {
		this.name = name;
		this.jssonToken = jssonToken;
	}
	
	@Override
	public String getName() {
		return name;
	}
	
	public String getJssonToken() {
		return jssonToken;
	}
	
}
