package gov.usgs.owi.javasinglesignon;

import java.security.Principal;

/**
 * Simple role implementation.
 * @author eeverman
 */
public class RemoteSingleSignonRole implements Principal {
	String name;
	
	public RemoteSingleSignonRole(String name) {
		this.name = name;
	}
	
	@Override
	public String getName() {
		return name;
	}
	
}
