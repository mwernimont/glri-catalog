package gov.usgs.cida.jmetertemplate;

import java.io.File;
import java.io.StringWriter;
import java.util.Map.Entry;
import java.util.Properties;
import org.apache.jmeter.services.FileServer;
import org.apache.jmeter.threads.JMeterContext;
import org.apache.jmeter.threads.JMeterVariables;
import org.apache.log.Logger;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.exception.MethodInvocationException;
import org.apache.velocity.exception.ParseErrorException;
import org.apache.velocity.exception.ResourceNotFoundException;

/**
 *
 * @author eeverman
 */
public class TemplateProcessor {

	public static String run(String templatePath, JMeterContext ctx, Logger log) throws Exception {

		//Invoke:  ${__BeanShell(gov.usgs.cida.jmetertemplate.Template.run("relOrAbsTemplatePath"\, ctx\, log))}
		
		JMeterVariables vars = ctx.getVariables();
		
		
		File templateFile = new File(templatePath);
		File baseDir = new File(FileServer.getFileServer().getBaseDir());
		File completeTemplateFile = null;
		
		//We need these separately as strings for velocity
		String templateFileName = "";
		String templateDirectory = "";
		
		
		
		

		if (templateFile.isAbsolute()) {
			completeTemplateFile = new File(templatePath);
		} else {
			completeTemplateFile = new File(baseDir, templatePath);
		}
		
		templateFileName = completeTemplateFile.getName();
		templateDirectory = completeTemplateFile.getParent();

		log.info("Found templatePath: " + templatePath + ", expanded to: " + templateFile.getCanonicalPath());

		if (!templateFile.exists() || !templateFile.canRead()) {
			log.error("The template file '" + templateFile.getCanonicalPath() + "' does not exist or cannot be read");
		}
		
		
		
		Properties props = new Properties();
		props.setProperty("resource.loader", "file");
		props.setProperty("file.resource.loader.class", "org.apache.velocity.runtime.resource.loader.FileResourceLoader");
		props.setProperty("file.resource.loader.path", templateDirectory);
		VelocityEngine engine = new VelocityEngine(props);
		engine.init();
		VelocityContext context = new VelocityContext();

		for (Entry<String, Object> entry : vars.entrySet()) {
			context.put(entry.getKey(), (entry.getValue() == null)?null:entry.getValue().toString());
		}
		

		Template template = null;
		template = engine.getTemplate(templateFileName);
		StringWriter sw = new StringWriter();
		template.merge(context, sw);

		return sw.toString();
	}

	public static String runTest(String arg1, String arg2) {
		return "got it:::: " + arg1 + arg2;
	}

	private static String getTypeInfo(Object obj, String label) {
		if (obj != null) {
			return label + ": " + obj.getClass().getName() + " : " + obj.toString();
		} else {
			return label + ": null";
		}
	}

	private static String toString(JMeterVariables vars) {
		String r = "{";

		for (Entry<String, Object> entry : vars.entrySet()) {
			r += "{" + entry.getKey() + "}";
		}

		return r + "}";
	}
}
