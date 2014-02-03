/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

import com.google.common.io.CharStreams;
import java.io.InputStreamReader;
import java.util.Map;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

/**
 *
 * @author eeverman
 */
public class ScienceBaseQuery {
	
	private static Format DEFAULT_FORMAT = Format.HTML;
	public static final String DEFAULT_ENCODING = "UTF-8";
	
	
	private Format format = Format.UNKNOWN;
	
	
	
	public String getQueryResponse(Map<String, String[]> requestParams) throws Exception {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		URIBuilder uriBuild = new URIBuilder();
		uriBuild.setScheme("https");
		uriBuild.setHost("www.sciencebase.gov");
		uriBuild.setPath("/catalog/items");
		uriBuild.setParameter("s", "Search");
		uriBuild.setParameter("q", "");
		uriBuild.setParameter("fields", "title,summary");
		appendControlParams(requestParams, uriBuild);
		appendGlriParams(requestParams, uriBuild);
		appendStandardParams(requestParams, uriBuild);
		
		HttpGet httpGet = new HttpGet(uriBuild.build());
		System.out.println(httpGet.getURI());
		httpGet.addHeader("Accept", "application/json,application/xml,text/html");
		CloseableHttpResponse response1 = httpclient.execute(httpGet);

		try {
			System.out.println(response1.getStatusLine());
			HttpEntity entity = response1.getEntity();
			
			String encoding = findEncoding(entity, DEFAULT_ENCODING);
			String stringFromStream = CharStreams.toString(new InputStreamReader(entity.getContent(), encoding));
			
			EntityUtils.consume(entity);
			
			return stringFromStream;
		} finally {
			response1.close();
		}

	}
	
	public Format getRequestedFormat() {
		return format;
	}
	
	/**
	 * Parses an http contentType header string into the encoding, if it exists.
	 * If it cannot find the encoding, the default is returned.
	 * 
	 * @param entity Find the header in this entity
	 * @param defaultEncoding Return this encoding if we cannot find the value in the header.
	 * @return 
	 */
	protected String findEncoding(HttpEntity entity, String defaultEncoding) {
		
		try {
			return findEncoding(entity.getContentType().getValue(), defaultEncoding);
		} catch (RuntimeException e) {
			return defaultEncoding;
		}
	}
	
	/**
	 * Parses an http contentType header string into the encoding, if it exists.
	 * If it cannot find the encoding, the default is returned.
	 * 
	 * @param contentTypeHeaderString The String value of the http contentType header
	 * @param defaultEncoding Return this encoding if we cannot find the value in the header.
	 * @return 
	 */
	protected String findEncoding(String contentTypeHeaderString, String defaultEncoding) {
		
		try {
			//Example contentType:  text/html; charset=utf-8

			String[] parts = contentTypeHeaderString.split(";");
			String encoding = StringUtils.trimToNull(parts[1]);
			parts = encoding.split("=");
			
			if (parts[0].trim().equalsIgnoreCase("charset")) {
				encoding = StringUtils.trimToNull(parts[1]);
				return encoding.toUpperCase();
			} else {
				return defaultEncoding;
			}
			
		} catch (RuntimeException e) {
			return defaultEncoding;
		}
	}
	
	protected void appendControlParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		for (ControlParam tag : ControlParam.values()) {
			String[] vals = requestParams.get(tag.getShortName());
			if (vals != null && vals.length > 0) {
				String val = StringUtils.trimToNull(vals[0]);
				if (val != null && ("true".equalsIgnoreCase(val) || "yes".equalsIgnoreCase(val))) {
					uriBuild.addParameter(tag.getFullName(), tag.getValue());
				}	
			}
		}
	}
	
	protected void appendGlriParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		for (GLRIParam tag : GLRIParam.values()) {
			String[] vals = requestParams.get(tag.getShortName());
			if (vals != null && vals.length > 0) {
				String val = StringUtils.trimToNull(vals[0]);
				if (val != null) {
					uriBuild.addParameter("filter", "tags={scheme:'" + tag.getFullName() + "',name:'" + val + "'}");
				}	
			}
		}
	}
	
	protected void appendStandardParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		
		boolean formatFound = false;
		
		for (ScienceBaseParam tag : ScienceBaseParam.values()) {
			String[] vals = requestParams.get(tag.getShortName());
			if (vals != null && vals.length > 0) {
				String val = StringUtils.trimToNull(vals[0]);
				if (val != null) {
					if (tag.equals(ScienceBaseParam.FORMAT)) {
						Format f = Format.UNKNOWN.getForShortName(val);
						format = f;
						formatFound = true;
					}
					uriBuild.addParameter(tag.getFullName(), val);
				}	
			}
		}
		
		if (!formatFound) {
			uriBuild.addParameter(ScienceBaseParam.FORMAT.getFullName(), DEFAULT_FORMAT.getShortName());
			format = DEFAULT_FORMAT;
		}
		
		
	}
}
